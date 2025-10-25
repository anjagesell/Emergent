#!/usr/bin/env python3
"""
Test multiple enhanced job applications to ensure system handles them correctly
"""

import requests
import json

BACKEND_URL = "https://care-network-4.preview.emergentagent.com/api"

def test_multiple_applications():
    """Test creating multiple enhanced job applications"""
    
    applications = [
        {
            "name": "Maria Gonzalez",
            "email": "maria.gonzalez@test.de",
            "phone": "+49 172 3456789",
            "position": "pflege",
            "about_yourself": "Ich bin eine erfahrene Pflegefachkraft mit 8 Jahren Berufserfahrung in verschiedenen Pflegeeinrichtungen. Meine Stärke liegt in der einfühlsamen Betreuung von Menschen mit Demenz.",
            "qualifications": "Examinierte Altenpflegerin, Palliativpflege Zertifikat, Wundmanagement Fortbildung",
            "empathic_abilities": "Durch meine langjährige Erfahrung habe ich gelernt, auch in schwierigen Situationen ruhig und verständnisvoll zu bleiben. Ich erkenne schnell die Bedürfnisse meiner Patienten.",
            "number_of_children": "1",
            "why_work_here": "Die flexible Arbeitszeiteinteilung bei OCTA würde es mir ermöglichen, mehr Zeit mit meiner Tochter zu verbringen, während ich weiterhin in meinem Traumberuf arbeiten kann.",
            "language": "de"
        },
        {
            "name": "Thomas Weber",
            "email": "thomas.weber@test.de", 
            "phone": "+49 173 4567890",
            "position": "hauswirtschaft",
            "about_yourself": "Als gelernter Hauswirtschafter bringe ich 3 Jahre Erfahrung in der Betreuung älterer Menschen mit. Ich bin sehr ordentlich und zuverlässig.",
            "qualifications": "Hauswirtschafter (IHK), Hygieneschulung, Erste-Hilfe-Kurs",
            "empathic_abilities": "Ich bin ein sehr geduldiger Mensch und kann gut mit älteren Menschen umgehen. Mir ist es wichtig, dass sich die betreuten Personen wohl und sicher fühlen.",
            "number_of_children": "0",
            "why_work_here": "OCTA hat einen sehr guten Ruf als Arbeitgeber und bietet interessante Entwicklungsmöglichkeiten. Die Werte des Unternehmens passen zu meinen eigenen Vorstellungen.",
            "language": "de"
        }
    ]
    
    print("=== Testing Multiple Enhanced Job Applications ===")
    
    created_ids = []
    
    for i, app_data in enumerate(applications, 1):
        print(f"\n--- Creating Application {i}: {app_data['name']} ---")
        
        try:
            response = requests.post(
                f"{BACKEND_URL}/job-applications",
                json=app_data,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                created_ids.append(result['id'])
                print(f"✅ Created application for {app_data['name']} (ID: {result['id']})")
            else:
                print(f"❌ Failed to create application for {app_data['name']}: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error creating application for {app_data['name']}: {str(e)}")
    
    # Test retrieving all applications
    print(f"\n--- Retrieving All Applications ---")
    try:
        response = requests.get(f"{BACKEND_URL}/job-applications", timeout=10)
        
        if response.status_code == 200:
            applications = response.json()
            print(f"✅ Retrieved {len(applications)} applications")
            
            # Verify all created applications are present
            retrieved_ids = [app['id'] for app in applications]
            missing_ids = [id for id in created_ids if id not in retrieved_ids]
            
            if missing_ids:
                print(f"❌ Missing applications: {missing_ids}")
            else:
                print("✅ All created applications are retrievable")
                
            # Show summary of applications
            for app in applications:
                print(f"  - {app['name']} ({app['position']}) - {app['email']}")
                
        else:
            print(f"❌ Failed to retrieve applications: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error retrieving applications: {str(e)}")

if __name__ == "__main__":
    test_multiple_applications()