import os
import sys

# Ensure backend src is on path
sys.path.insert(0, os.path.dirname(__file__))

from src.database.connection import get_client
from src.config.settings import settings
from src.marketing.service import MarketingService

def purge_all_mock_data():
    client = get_client()
    db = client[settings.MONGODB_DB_NAME]
    
    print("=" * 70)
    print("  PURGING ALL MOCK, DEMO & TEST DATA (PRESERVING REAL DATA)")
    print("=" * 70)
    
    # -------------------------------------------------------------
    # 1. Referral Users, Links & Click Logs in 'test' database
    # -------------------------------------------------------------
    for tdb_name in ["test", "referral_db"]:
        if tdb_name in client.list_database_names():
            tdb = client[tdb_name]
            print(f"\n--- Cleaning database: {tdb_name} ---")
            
            # Delete USR-DEMO1
            res = tdb.ref_users.delete_many({"$or": [{"userId": "USR-DEMO1"}, {"email": "demo@example.com"}]})
            print(f"  [{tdb_name}.ref_users] Deleted {res.deleted_count} demo user(s).")
            
            # Delete demo ref_links
            res = tdb.ref_links.delete_many({"$or": [{"userId": "USR-DEMO1"}, {"code": {"$regex": "^demo-"}}]})
            print(f"  [{tdb_name}.ref_links] Deleted {res.deleted_count} demo referral link(s).")
            
            # Delete demo ref_click_logs
            res = tdb.ref_click_logs.delete_many({
                "$or": [
                    {"code": {"$regex": "^demo-"}},
                    {"ip": {"$in": ["127.0.0.1", "127.0.0.2", "127.0.0.3"]}, "code": {"$regex": "^demo-"}}
                ]
            })
            print(f"  [{tdb_name}.ref_click_logs] Deleted {res.deleted_count} demo click log(s).")
            
            # Delete mock referral submissions
            res = tdb.referralsubmissions.delete_many({
                "$or": [
                    {"name": {"$regex": "^Test", "$options": "i"}},
                    {"email": {"$regex": "test|example.com", "$options": "i"}}
                ]
            })
            print(f"  [{tdb_name}.referralsubmissions] Deleted {res.deleted_count} mock referral submission(s).")

    # -------------------------------------------------------------
    # 2. Marketing Links & Clicks in 'unified_service_db'
    # -------------------------------------------------------------
    print(f"\n--- Cleaning database: {settings.MONGODB_DB_NAME} ---")
    
    mock_slugs = [
        "demo-aisa", "demo-ailegal", "demo-aiads", "demo-aicashfl", 
        "demo-aimall", "demo-aisaconn", "demo-efv", "demo-uwo",
        "aieducation-ref-demouser-64801",
        "test-sync-probe-123",
        "ailegal", "ailegal_", "ailegall", "ailegall4", "ailegall5",
        "ai-legal", "ai-legal7", "ai-legal8", "ai-legal9",
        "aied-ins-college-prom-faa75", "aile-ins-law-8e3a2"
    ]
    
    # Also find any other links with post_name Lawyer / Lawyer* or created_by USR-DEMO1
    matching_links = list(db.marketing_links.find({
        "$or": [
            {"slug": {"$in": mock_slugs}},
            {"slug": {"$regex": "^demo-"}},
            {"created_by": "USR-DEMO1"},
            {"post_name": {"$regex": "^(Lawyer|Lawyer[0-9]|College Promo|USR_PROBE)"}},
            {"campaign_name": {"$regex": "^Campaign[0-9]"}}
        ]
    }))
    
    slugs_to_delete = list(set([l["slug"] for l in matching_links if "slug" in l]))
    ids_to_delete = [l["_id"] for l in matching_links]
    
    print(f"  [marketing_links] Found {len(ids_to_delete)} mock/demo/test links to delete:")
    for l in matching_links:
        print(f"    - {l.get('slug')} (Post: {l.get('post_name')}, Campaign: {l.get('campaign_name')}, Product: {l.get('product_name')})")
        
    res = db.marketing_links.delete_many({"_id": {"$in": ids_to_delete}})
    print(f"  [marketing_links] Deleted {res.deleted_count} link document(s).")
    
    # Delete associated marketing clicks
    res = db.marketing_clicks.delete_many({
        "$or": [
            {"slug": {"$in": slugs_to_delete}},
            {"link_id": {"$in": [str(i) for i in ids_to_delete] + ids_to_delete}},
            {"post_name": {"$in": ["USR-DEMO1", "USR_PROBE", "ReferralUser"]}}
        ]
    })
    print(f"  [marketing_clicks] Deleted {res.deleted_count} associated mock click(s).")
    
    # -------------------------------------------------------------
    # 3. Simulated Logs in 'logs'
    # -------------------------------------------------------------
    res = db.logs.delete_many({
        "$or": [
            {"user_id": {"$regex": "^usr_demo_"}},
            {"message": {"$regex": "^Simulated"}}
        ]
    })
    print(f"\n  [logs] Deleted {res.deleted_count} simulated demo log(s).")

    # -------------------------------------------------------------
    # 4. Demo Chats in 'chat_tracking'
    # -------------------------------------------------------------
    res = db.chat_tracking.delete_many({"user_id": {"$regex": "^usr_demo_"}})
    print(f"  [chat_tracking] Deleted {res.deleted_count} demo chat tracking record(s).")

    # -------------------------------------------------------------
    # 5. Mock Revenue Transactions in 'revenue_transactions'
    # -------------------------------------------------------------
    res = db.revenue_transactions.delete_many({
        "$or": [
            {"external_transaction_id": {"$regex": "^mock_iap_"}},
            {"external_transaction_id": "test_bypass_token"},
            {"customer_email": "test_legal_agent@example.com"}
        ]
    })
    print(f"  [revenue_transactions] Deleted {res.deleted_count} mock/test transaction(s).")

    # -------------------------------------------------------------
    # 6. Automated Test Subscribers & Contacts
    # -------------------------------------------------------------
    res = db.subscribers.delete_many({"email": {"$regex": "^test_auto_"}})
    print(f"  [subscribers] Deleted {res.deleted_count} test subscriber(s).")

    res = db.contacts.delete_many({"email": {"$regex": "^test_auto_"}})
    print(f"  [contacts] Deleted {res.deleted_count} test contact(s).")

    # -------------------------------------------------------------
    # 7. Mock Referral Submissions in unified_service_db
    # -------------------------------------------------------------
    res = db.referralsubmissions.delete_many({
        "$or": [
            {"name": "Test Partner"},
            {"email": "rahul.test@example.com"}
        ]
    })
    print(f"  [referralsubmissions] Deleted {res.deleted_count} test referral submission(s).")

    # -------------------------------------------------------------
    # 8. Demo Referral Installs
    # -------------------------------------------------------------
    res = db.referral_installs.delete_many({"referral_code": "demo_test_code"})
    print(f"  [referral_installs] Deleted {res.deleted_count} demo referral install(s).")

    # -------------------------------------------------------------
    # 9. Clean Test User in ai_ads_db (if exists)
    # -------------------------------------------------------------
    if "ai_ads_db" in client.list_database_names():
        res = client["ai_ads_db"].users.delete_many({"email": "test.unified@uwo24.com"})
        print(f"  [ai_ads_db.users] Deleted {res.deleted_count} test user(s).")

    # -------------------------------------------------------------
    # 10. Reconcile & Synchronize Telemetry
    # -------------------------------------------------------------
    print("\n--- Reconciling Telemetry & Install Counters ---")
    MarketingService.reconcile_duplicate_installs()
    MarketingService.migrate_legacy_links()
    print("  Reconciliation complete.")

    # -------------------------------------------------------------
    # Summary of Remaining Real Data
    # -------------------------------------------------------------
    print("\n" + "=" * 70)
    print("  PURGE COMPLETE! SUMMARY OF REMAINING REAL DATA:")
    print("=" * 70)
    print(f"  Marketing Links remaining: {db.marketing_links.count_documents({})}")
    for l in db.marketing_links.find({}):
        print(f"    - Slug: {l.get('slug')}, Post: {l.get('post_name')}, Product: {l.get('product_name')}, Clicks: {l.get('total_clicks')}, Downloads: {l.get('total_downloads')}")
        
    for tdb_name in ["test", "referral_db"]:
        if tdb_name in client.list_database_names():
            tdb = client[tdb_name]
            print(f"\n  [{tdb_name}] Real Users remaining: {tdb.ref_users.count_documents({})}")
            for u in tdb.ref_users.find({}):
                print(f"    - {u.get('name')} ({u.get('userId')}, {u.get('email')})")
            print(f"  [{tdb_name}] Real Referral Links remaining: {tdb.ref_links.count_documents({})}")
            for r in tdb.ref_links.find({}):
                print(f"    - Code: {r.get('code')}, User: {r.get('userId')}, Clicks: {r.get('clicks')}")

    print(f"\n  Central Logs remaining: {db.logs.count_documents({})}")
    print(f"  Chat Tracking remaining: {db.chat_tracking.count_documents({})}")
    print(f"  Revenue Transactions remaining: {db.revenue_transactions.count_documents({})}")
    print(f"  Subscribers remaining: {db.subscribers.count_documents({})}")
    print(f"  Contacts remaining: {db.contacts.count_documents({})}")
    print("=" * 70)

if __name__ == "__main__":
    purge_all_mock_data()
