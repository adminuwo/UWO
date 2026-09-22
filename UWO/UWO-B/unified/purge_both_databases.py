import pymongo
import dns.resolver
import sys
import os

sys.path.insert(0, r"c:\Users\WELCOME\Desktop\project\uwo\UWO\UWO-B\unified")

from src.database.connection import get_client
from src.config.settings import settings
from src.marketing.service import MarketingService

resolver = dns.resolver.Resolver(configure=False)
resolver.nameservers = ['8.8.8.8', '1.1.1.1']
dns.resolver.default_resolver = resolver

# 1. Connect to cluster0 (UWO-web)
uwo_uri = "mongodb+srv://uwo_admin:uwo%4012345@cluster0.selr4is.mongodb.net/UWO-web?retryWrites=true&w=majority"
uwo_client = pymongo.MongoClient(uwo_uri, tlsAllowInvalidCertificates=True)
uwo_db = uwo_client["UWO-web"]

# 2. Connect to unified cluster (unified_service_db & test)
unified_client = get_client()
unified_db = unified_client[settings.MONGODB_DB_NAME]
test_db = unified_client["test"]

print("======================================================================")
print("  CLEANING MOCK / DEMO DATA FROM BOTH MONGODB CLUSTERS")
print("======================================================================")

# Slugs to remove from everywhere
mock_slugs = [
    "demo-aisa", "demo-ailegal", "demo-aiads", "demo-aicashfl", 
    "demo-aimall", "demo-aisaconn", "demo-efv", "demo-uwo",
    "aieducation-ref-demouser-64801",
    "test-sync-probe-123",
    "usr85859-3vf8j",
    "aied-ins-college-prom-faa75", "aile-ins-law-8e3a2"
]
mock_user_ids = ["USR-DEMO1", "USR-85859", "USR_PROBE"]
mock_emails = ["demo@example.com", "partner.test.1789538747864@uwo24.com"]

# --- A. Clean UWO-web on cluster0 ---
print("\n[A] Cleaning UWO-web (cluster0)...")
res_u = uwo_db.ref_users.delete_many({"$or": [{"userId": {"$in": mock_user_ids}}, {"email": {"$in": mock_emails}}]})
print(f"  Deleted {res_u.deleted_count} mock users from UWO-web.ref_users")

res_l = uwo_db.ref_links.delete_many({"$or": [{"userId": {"$in": mock_user_ids}}, {"code": {"$in": mock_slugs}}, {"code": {"$regex": "^demo-"}}]})
print(f"  Deleted {res_l.deleted_count} mock links from UWO-web.ref_links")

res_c = uwo_db.ref_click_logs.delete_many({"$or": [{"code": {"$in": mock_slugs}}, {"code": {"$regex": "^demo-"}}]})
print(f"  Deleted {res_c.deleted_count} mock click logs from UWO-web.ref_click_logs")

res_d = uwo_db.ref_download_logs.delete_many({"$or": [{"code": {"$in": mock_slugs}}, {"user_id": {"$in": mock_user_ids}}]})
print(f"  Deleted {res_d.deleted_count} mock download logs from UWO-web.ref_download_logs")

# Also delete from users table in UWO-web if present
res_uw = uwo_db.users.delete_many({"email": {"$in": mock_emails}})
print(f"  Deleted {res_uw.deleted_count} mock users from UWO-web.users")

# --- B. Clean test db on unified cluster ---
print("\n[B] Cleaning test database...")
test_db.ref_users.delete_many({"$or": [{"userId": {"$in": mock_user_ids}}, {"email": {"$in": mock_emails}}]})
test_db.ref_links.delete_many({"$or": [{"userId": {"$in": mock_user_ids}}, {"code": {"$in": mock_slugs}}, {"code": {"$regex": "^demo-"}}]})
test_db.ref_click_logs.delete_many({"$or": [{"code": {"$in": mock_slugs}}, {"code": {"$regex": "^demo-"}}]})

# --- C. Clean unified_service_db ---
print("\n[C] Cleaning unified_service_db...")
res_ml = unified_db.marketing_links.delete_many({
    "$or": [
        {"slug": {"$in": mock_slugs}},
        {"slug": {"$regex": "^demo-"}},
        {"created_by": {"$in": mock_user_ids + mock_emails}},
        {"post_name": {"$in": mock_user_ids + ["Lawyer", "Lawyer2", "Lawyer3", "Lawyer4", "Lawyer5", "Lawyer6", "Lawyer7", "Lawyer8", "Lawyer9", "College Promo 1", "Law"]}},
        {"campaign_name": {"$regex": "^Campaign[0-9]"}}
    ]
})
print(f"  Deleted {res_ml.deleted_count} mock links from unified_service_db.marketing_links")

res_mc = unified_db.marketing_clicks.delete_many({
    "$or": [
        {"slug": {"$in": mock_slugs}},
        {"slug": {"$regex": "^demo-"}},
        {"post_name": {"$in": mock_user_ids + ["ReferralUser", "USR-DEMO1", "USR_PROBE"]}}
    ]
})
print(f"  Deleted {res_mc.deleted_count} mock clicks from unified_service_db.marketing_clicks")

res_md = unified_db.marketing_downloads.delete_many({
    "$or": [
        {"slug": {"$in": mock_slugs}},
        {"user_id": {"$in": mock_user_ids}}
    ]
})
print(f"  Deleted {res_md.deleted_count} mock downloads from unified_service_db.marketing_downloads")

# Reconcile Marketing Links counters
MarketingService.reconcile_duplicate_installs()
MarketingService.migrate_legacy_links()

print("\n======================================================================")
print("  FINAL AUDIT ACROSS BOTH CLUSTERS:")
print("======================================================================")
print("\n1. UWO-web (cluster0):")
print("  Users remaining:")
for u in uwo_db.ref_users.find({}):
    print(f"    - {u.get('name')} ({u.get('userId')}, {u.get('email')})")
print("  Referral Links remaining:")
for l in uwo_db.ref_links.find({}):
    print(f"    - {l.get('code')} ({l.get('userId')}, clicks: {l.get('clicks')})")

print("\n2. unified_service_db (unified-dashboard cluster):")
print("  Marketing Links remaining:")
for l in unified_db.marketing_links.find({}):
    print(f"    - Slug: {l.get('slug')}, Post: {l.get('post_name')}, Campaign: {l.get('campaign_name')}, Product: {l.get('product_name')}, Clicks: {l.get('total_clicks')}, Downloads: {l.get('total_downloads')}")

print("\n3. test DB:")
print("  Users remaining:")
for u in test_db.ref_users.find({}):
    print(f"    - {u.get('name')} ({u.get('userId')}, {u.get('email')})")
print("  Referral Links remaining:")
for l in test_db.ref_links.find({}):
    print(f"    - {l.get('code')} ({l.get('userId')}, clicks: {l.get('clicks')})")
print("======================================================================")
