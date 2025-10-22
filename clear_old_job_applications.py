#!/usr/bin/env python3
"""
Clear old job applications from database to test enhanced model
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

async def clear_old_job_applications():
    """Clear old job applications that don't match the enhanced model"""
    
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    try:
        # Find all job applications
        applications = await db.job_applications.find({}).to_list(1000)
        print(f"Found {len(applications)} job applications in database")
        
        # Check which ones are missing the new required fields
        old_applications = []
        for app in applications:
            missing_fields = []
            required_new_fields = ['about_yourself', 'qualifications', 'empathic_abilities', 'number_of_children', 'why_work_here']
            
            for field in required_new_fields:
                if field not in app:
                    missing_fields.append(field)
            
            if missing_fields:
                old_applications.append({
                    'id': app.get('id', 'unknown'),
                    'name': app.get('name', 'unknown'),
                    'missing_fields': missing_fields
                })
        
        print(f"Found {len(old_applications)} old applications that need to be removed:")
        for app in old_applications:
            print(f"  - {app['name']} (ID: {app['id']}) - Missing: {app['missing_fields']}")
        
        if old_applications:
            # Delete all job applications to start fresh
            result = await db.job_applications.delete_many({})
            print(f"Deleted {result.deleted_count} old job applications")
        else:
            print("No old applications found - all applications match the enhanced model")
        
    except Exception as e:
        print(f"Error: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(clear_old_job_applications())