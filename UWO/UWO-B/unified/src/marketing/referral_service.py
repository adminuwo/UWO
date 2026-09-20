from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
import pymongo  # type: ignore
import certifi  # type: ignore
from src.config.settings import settings

_uwo_client: Optional[pymongo.MongoClient] = None


def get_uwo_db():
    """Get MongoDB database connection to UWO-web for referral ecosystem data."""
    global _uwo_client
    if _uwo_client is None:
        uri = settings.UWO_MONGODB_URI or settings.MONGODB_URL
        try:
            _uwo_client = pymongo.MongoClient(
                uri,
                tlsCAFile=certifi.where(),
                serverSelectionTimeoutMS=8000,
                retryWrites=True,
                maxPoolSize=10
            )
            _uwo_client.admin.command('ping')
            print(f"[UserReferralService] Successfully connected to UWO Referral Database ({settings.UWO_MONGODB_DB_NAME})")
        except Exception as e:
            print(f"[UserReferralService Warning] Could not connect to UWO database: {e}")
            from src.database.connection import get_client
            return get_client()[settings.MONGODB_DB_NAME]

    db_name = settings.UWO_MONGODB_DB_NAME or "UWO-web"
    return _uwo_client[db_name]


class UserReferralService:
    @staticmethod
    def get_summary() -> Dict[str, Any]:
        """Aggregate high-level KPIs for User Referral & Earn-and-Refer program."""
        db = get_uwo_db()

        try:
            total_users = db.ref_users.count_documents({})
        except Exception:
            total_users = 0

        try:
            total_links = db.ref_links.count_documents({})
        except Exception:
            total_links = 0

        try:
            total_submissions = db.referralsubmissions.count_documents({})
        except Exception:
            total_submissions = 0

        # Aggregate total and unique clicks
        total_clicks = 0
        unique_clicks = 0
        total_downloads = 0
        try:
            pipeline = [
                {"$group": {
                    "_id": None,
                    "clicks": {"$sum": "$clicks"},
                    "uniqueClicks": {"$sum": "$uniqueClicks"},
                    "downloads": {"$sum": "$downloads"}
                }}
            ]
            agg = list(db.ref_links.aggregate(pipeline))
            if agg:
                total_clicks = agg[0].get("clicks", 0)
                unique_clicks = agg[0].get("uniqueClicks", 0)
                total_downloads = agg[0].get("downloads", 0)
        except Exception as e:
            print(f"[UserReferralService] Aggregate ref_links notice: {e}")

        # If download logs exist, compute platform breakdown
        android_downloads = 0
        ios_downloads = 0
        try:
            android_downloads = db.ref_download_logs.count_documents({"platform": "android"})
            ios_downloads = db.ref_download_logs.count_documents({"platform": "ios"})
            log_downloads = android_downloads + ios_downloads
            if log_downloads > total_downloads:
                total_downloads = log_downloads
        except Exception:
            pass

        return {
            "total_referral_users": total_users,
            "total_links": total_links,
            "total_submissions": total_submissions,
            "total_clicks": total_clicks,
            "unique_clicks": unique_clicks,
            "total_downloads": total_downloads,
            "android_downloads": android_downloads,
            "ios_downloads": ios_downloads,
            "conversion_rate": round((total_downloads / total_clicks * 100), 1) if total_clicks > 0 else 0.0,
            "last_updated": datetime.now(timezone.utc).isoformat()
        }

    @staticmethod
    def list_user_links(limit: int = 200, base_url: str = "") -> List[Dict[str, Any]]:
        """List all referral links created by users with populated user and product details."""
        db = get_uwo_db()

        # Build caches for fast join
        user_cache = {}
        try:
            for u in db.ref_users.find({}, {"_id": 1, "userId": 1, "name": 1, "email": 1}):
                user_cache[str(u["_id"])] = {
                    "userId": u.get("userId", "UNKNOWN"),
                    "name": u.get("name", "Referral User"),
                    "email": u.get("email", "")
                }
        except Exception as e:
            print(f"[UserReferralService] User cache notice: {e}")

        product_cache = {}
        try:
            for p in db.ref_products.find({}, {"_id": 1, "name": 1, "slug": 1, "webUrl": 1, "androidUrl": 1, "iosUrl": 1}):
                product_cache[str(p["_id"])] = {
                    "name": p.get("name", "Product"),
                    "slug": p.get("slug", ""),
                    "webUrl": p.get("webUrl", ""),
                    "androidUrl": p.get("androidUrl", ""),
                    "iosUrl": p.get("iosUrl", "")
                }
        except Exception as e:
            print(f"[UserReferralService] Product cache notice: {e}")

        links_out = []
        try:
            raw_links = list(db.ref_links.find({}).sort("createdAt", -1).limit(limit))
            for l in raw_links:
                uid_k = str(l.get("user", ""))
                pid_k = str(l.get("product", ""))

                user_info = user_cache.get(uid_k, {
                    "userId": l.get("userId", "UNKNOWN"),
                    "name": "Referral Partner",
                    "email": ""
                })
                prod_info = product_cache.get(pid_k, {
                    "name": "UWO Product",
                    "slug": "uwo",
                    "webUrl": "https://uwo24.com"
                })

                code = l.get("code", "")
                if base_url and ("localhost" in base_url or "127.0.0.1" in base_url):
                    redirect_base = base_url.rstrip('/')
                else:
                    redirect_base = "https://uwo24.com"

                links_out.append({
                    "id": str(l["_id"]),
                    "code": code,
                    "userId": l.get("userId") or user_info["userId"],
                    "user": user_info,
                    "product": prod_info,
                    "clicks": l.get("clicks", 0),
                    "uniqueClicks": l.get("uniqueClicks", 0),
                    "downloads": l.get("downloads", 0),
                    "fullUrl": f"{redirect_base}/r/{code}",
                    "createdAt": l.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(l.get("createdAt"), datetime) else str(l.get("createdAt") or "")
                })
        except Exception as e:
            print(f"[UserReferralService] Error listing user links: {e}")

        return links_out

    @staticmethod
    def list_registrations(limit: int = 100) -> List[Dict[str, Any]]:
        """List all applicant submissions from the Earn & Refer form on the UWO website."""
        db = get_uwo_db()
        submissions = []

        try:
            raw = list(db.referralsubmissions.find({}).sort("createdAt", -1).limit(limit))
            for s in raw:
                submissions.append({
                    "id": str(s["_id"]),
                    "name": s.get("name", "Applicant"),
                    "email": s.get("email", ""),
                    "phone": s.get("phone", ""),
                    "referralCode": s.get("referralCode", ""),
                    "preferredProgram": s.get("preferredProgram", "All Platforms"),
                    "upiId": s.get("upiId", ""),
                    "message": s.get("message", ""),
                    "affiliateCode": s.get("affiliateCode", ""),
                    "createdAt": s.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(s.get("createdAt"), datetime) else str(s.get("createdAt") or "")
                })
        except Exception as e:
            print(f"[UserReferralService] Error listing registrations: {e}")

        return submissions

    @staticmethod
    def get_activity_feed(limit: int = 50) -> List[Dict[str, Any]]:
        """Chronological combined event stream of user referral clicks and verified app installs."""
        db = get_uwo_db()

        # Build product map
        product_map = {}
        try:
            for p in db.ref_products.find({}, {"_id": 1, "name": 1, "slug": 1}):
                product_map[str(p["_id"])] = p.get("name", "Product")
        except Exception:
            pass

        events = []
        # 1. Recent Clicks
        try:
            clicks = list(db.ref_click_logs.find({}).sort("createdAt", -1).limit(limit))
            for c in clicks:
                pid = str(c.get("product", ""))
                prod_name = product_map.get(pid, "UWO Product")
                raw_ip = c.get("ip", "")
                masked_ip = raw_ip
                if "." in raw_ip:
                    parts = raw_ip.split(".")
                    if len(parts) == 4:
                        masked_ip = f"{parts[0]}.{parts[1]}.***.***"

                events.append({
                    "id": str(c["_id"]),
                    "type": "click",
                    "title": f"{prod_name} Link Clicked",
                    "productName": prod_name,
                    "code": c.get("code", ""),
                    "deviceType": c.get("deviceType", "desktop"),
                    "ip": masked_ip,
                    "targetUrl": c.get("targetUrl", ""),
                    "isUnique": c.get("isUnique", True),
                    "timestamp": c.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(c.get("createdAt"), datetime) else str(c.get("createdAt") or "")
                })
        except Exception as e:
            print(f"[UserReferralService] Click activity notice: {e}")

        # 2. Recent Downloads / App Installs
        try:
            downloads = list(db.ref_download_logs.find({}).sort("createdAt", -1).limit(limit))
            for d in downloads:
                pid = str(d.get("product", ""))
                prod_name = product_map.get(pid, "UWO Product")
                raw_ip = d.get("ip", "")
                masked_ip = raw_ip
                if "." in raw_ip:
                    parts = raw_ip.split(".")
                    if len(parts) == 4:
                        masked_ip = f"{parts[0]}.{parts[1]}.***.***"

                events.append({
                    "id": str(d["_id"]),
                    "type": "download",
                    "title": f"Verified {d.get('platform', 'App').upper()} Install",
                    "productName": prod_name,
                    "code": d.get("code", ""),
                    "userId": d.get("userId", ""),
                    "deviceType": d.get("platform", "android"),
                    "platform": d.get("platform", "android"),
                    "attributionMethod": d.get("attributionMethod", "store_referrer"),
                    "ip": masked_ip,
                    "isUnique": True,
                    "timestamp": d.get("createdAt", datetime.now(timezone.utc)).isoformat() if isinstance(d.get("createdAt"), datetime) else str(d.get("createdAt") or "")
                })
        except Exception as e:
            print(f"[UserReferralService] Download activity notice: {e}")

        events.sort(key=lambda x: x["timestamp"], reverse=True)
        return events[:limit]
