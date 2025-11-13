#!/usr/bin/env python3
"""
Final fix for character name variations in events
"""

import json
import os

def load_json_file(filepath):
    """Load JSON file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def save_json_file(filepath, data):
    """Save JSON file"""
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f"Error saving {filepath}: {e}")
        return False

def find_character_id_by_name_variations(characters_data, target_name):
    """Find character ID by checking name variations"""
    # Direct match first
    for char in characters_data:
        if char['name'] == target_name:
            return char['id']
    
    # Check variations
    variations = {
        "Rigault de Genouilly": ["Charles Rigault de Genouilly"],
        "Page": ["François Page", "Thủy sư Đô đốc François Page"],
        "De Vassoigne": ["Đại tá De Vassoigne"],
        "Jauréguiberry": ["Bernard Jauréguiberry", "Thuyền trưởng Bernard Jauréguiberry"]
    }
    
    if target_name in variations:
        for variation in variations[target_name]:
            for char in characters_data:
                if char['name'] == variation:
                    return char['id']
    
    return None

def find_event_by_id(events_data, event_id):
    """Find event by ID"""
    for event in events_data:
        if event.get('id') == event_id:
            return event
    return None

def main():
    print("🔧 Final fix for character name variations...")
    
    # File paths
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    events_file = os.path.join(base_path, 'data', 'events.json')
    
    # Load data
    characters_data = load_json_file(characters_file)
    events_data = load_json_file(events_file)
    
    if not characters_data or not events_data:
        print("❌ Failed to load data files")
        return
    
    print(f"📊 Loaded {len(characters_data)} characters and {len(events_data)} events")
    
    # Final fixes for remaining issues
    final_fixes = {
        "event-002": ["Rigault de Genouilly"],  # Should match Charles Rigault de Genouilly
        "event-034": ["Rigault de Genouilly", "Page"],  # Should match Charles Rigault de Genouilly and François Page
        "event-043": ["De Vassoigne", "Jauréguiberry"]  # Should match Đại tá De Vassoigne and Bernard Jauréguiberry
    }
    
    fixed_events = 0
    total_assignments_added = 0
    
    for event_id, missing_chars in final_fixes.items():
        event = find_event_by_id(events_data, event_id)
        
        if event:
            current_chars = event.get('relatedCharacters', [])
            added_chars = []
            
            for char_name in missing_chars:
                char_id = find_character_id_by_name_variations(characters_data, char_name)
                
                if char_id:
                    if char_id not in current_chars:
                        current_chars.append(char_id)
                        added_chars.append(char_name)
                        total_assignments_added += 1
                    else:
                        print(f"   {char_name} already in {event_id}")
                else:
                    print(f"⚠️  Character '{char_name}' still not found for {event_id}")
            
            if added_chars:
                event['relatedCharacters'] = current_chars
                fixed_events += 1
                print(f"✅ Fixed {event_id}: {event.get('name', 'Unknown')}")
                print(f"   Added: {', '.join(added_chars)}")
                print(f"   Total characters: {len(current_chars)}")
        else:
            print(f"⚠️  Event {event_id} not found")
    
    # Save updated events
    if save_json_file(events_file, events_data):
        print(f"\n🎉 Successfully completed final fixes!")
        print(f"   🔧 Fixed events: {fixed_events}")
        print(f"   ➕ Total assignments added: {total_assignments_added}")
        print(f"   📁 Saved to: {events_file}")
    else:
        print("❌ Failed to save events.json")

if __name__ == "__main__":
    main()
