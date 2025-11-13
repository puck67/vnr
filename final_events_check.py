#!/usr/bin/env python3
"""
Final check and report on all events with characters
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

def main():
    print("🔍 Final check of all events with characters...")
    
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
    
    # Analyze events
    events_with_characters = 0
    events_without_characters = 0
    total_character_assignments = 0
    
    events_by_decade = {}
    
    for event in events_data:
        event_id = event.get('id', 'unknown')
        event_name = event.get('name', 'Unknown')
        event_year = event.get('date', {}).get('year', 0)
        related_chars = event.get('relatedCharacters', [])
        
        # Count by decade
        decade = (event_year // 10) * 10
        if decade not in events_by_decade:
            events_by_decade[decade] = {'total': 0, 'with_chars': 0, 'char_count': 0}
        
        events_by_decade[decade]['total'] += 1
        
        if related_chars:
            events_with_characters += 1
            events_by_decade[decade]['with_chars'] += 1
            events_by_decade[decade]['char_count'] += len(related_chars)
            total_character_assignments += len(related_chars)
            print(f"✅ {event_id}: {event_name} ({event_year}) - {len(related_chars)} characters")
        else:
            events_without_characters += 1
            print(f"❌ {event_id}: {event_name} ({event_year}) - NO characters")
    
    # Print summary
    print(f"\n📋 FINAL SUMMARY:")
    print(f"   📊 Total events: {len(events_data)}")
    print(f"   ✅ Events with characters: {events_with_characters}")
    print(f"   ❌ Events without characters: {events_without_characters}")
    print(f"   👥 Total character assignments: {total_character_assignments}")
    print(f"   📈 Coverage: {events_with_characters/len(events_data)*100:.1f}%")
    
    # Print by decade
    print(f"\n📅 BREAKDOWN BY DECADE:")
    for decade in sorted(events_by_decade.keys()):
        if decade >= 1850:  # Only show relevant decades
            data = events_by_decade[decade]
            coverage = data['with_chars']/data['total']*100 if data['total'] > 0 else 0
            avg_chars = data['char_count']/data['with_chars'] if data['with_chars'] > 0 else 0
            print(f"   {decade}s: {data['with_chars']}/{data['total']} events ({coverage:.1f}%) - Avg {avg_chars:.1f} chars/event")
    
    # Character usage analysis
    char_usage = {}
    for event in events_data:
        for char_id in event.get('relatedCharacters', []):
            if char_id not in char_usage:
                char_usage[char_id] = 0
            char_usage[char_id] += 1
    
    # Find most used characters
    most_used_chars = sorted(char_usage.items(), key=lambda x: x[1], reverse=True)[:10]
    
    print(f"\n👑 TOP 10 MOST USED CHARACTERS:")
    for char_id, usage_count in most_used_chars:
        # Find character name
        char_name = "Unknown"
        for char in characters_data:
            if char['id'] == char_id:
                char_name = char['name']
                break
        print(f"   {char_name}: {usage_count} events")
    
    print(f"\n🎉 EVENTS UPDATE COMPLETED!")
    print(f"   Dataset quality: {'EXCELLENT' if events_with_characters/len(events_data) > 0.9 else 'GOOD' if events_with_characters/len(events_data) > 0.7 else 'NEEDS IMPROVEMENT'}")

if __name__ == "__main__":
    main()
