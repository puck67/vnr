#!/usr/bin/env python3
"""
Script to analyze characters and events data to identify characters who directly participated 
in historical events from 1858-1930 and remove those who didn't.
"""

import json
import os
from datetime import datetime

def load_json_file(filepath):
    """Load JSON file and return data"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def analyze_events_by_year(events_data):
    """Analyze events and filter those between 1858-1930"""
    relevant_events = []
    
    for event in events_data:
        if 'date' in event and 'year' in event['date']:
            year = event['date']['year']
            if 1858 <= year <= 1930:
                relevant_events.append(event)
                print(f"Event {event['id']}: {event['name']} ({year})")
    
    return relevant_events

def analyze_character_participation(characters_data, relevant_events):
    """Analyze which characters participated in relevant events"""
    relevant_event_ids = {event['id'] for event in relevant_events}
    participating_characters = []
    non_participating_characters = []
    
    for character in characters_data:
        char_events = set(character.get('relatedEvents', []))
        
        # Check if character has any events in the 1858-1930 period
        has_relevant_events = bool(char_events.intersection(relevant_event_ids))
        
        # Also check birth/death years to see if they lived during this period
        birth_year = character.get('birthYear', 0)
        death_year = character.get('deathYear', 9999)
        
        # Character must have lived during 1858-1930 AND participated in events
        lived_during_period = (birth_year <= 1930 and death_year >= 1858)
        
        if has_relevant_events and lived_during_period:
            participating_characters.append(character)
            print(f"✓ KEEP: {character['name']} ({birth_year}-{death_year}) - Events: {len(char_events.intersection(relevant_event_ids))}")
        else:
            non_participating_characters.append(character)
            reason = []
            if not has_relevant_events:
                reason.append("no relevant events")
            if not lived_during_period:
                reason.append(f"lived {birth_year}-{death_year}")
            print(f"✗ REMOVE: {character['name']} ({birth_year}-{death_year}) - Reason: {', '.join(reason)}")
    
    return participating_characters, non_participating_characters

def save_results(participating_chars, removed_chars, base_path):
    """Save the results to files"""
    
    # Save participating characters (cleaned dataset)
    cleaned_file = os.path.join(base_path, 'data', 'characters_cleaned.json')
    with open(cleaned_file, 'w', encoding='utf-8') as f:
        json.dump(participating_chars, f, ensure_ascii=False, indent=2)
    
    # Save removed characters for reference
    removed_file = os.path.join(base_path, 'data', 'removed_characters.json')
    with open(removed_file, 'w', encoding='utf-8') as f:
        json.dump(removed_chars, f, ensure_ascii=False, indent=2)
    
    print(f"\n📁 Files saved:")
    print(f"   - Cleaned characters: {cleaned_file}")
    print(f"   - Removed characters: {removed_file}")

def main():
    base_path = r'c:\Users\Adminn\Desktop\prm\vnr'
    
    # Load data files
    print("Loading data files...")
    characters_file = os.path.join(base_path, 'data', 'characters.json')
    events_file = os.path.join(base_path, 'data', 'events.json')
    
    characters_data = load_json_file(characters_file)
    events_data = load_json_file(events_file)
    
    if not characters_data or not events_data:
        print("Failed to load data files!")
        return
    
    print(f"Loaded {len(characters_data)} characters and {len(events_data)} events")
    
    # Analyze events in the 1858-1930 period
    print("\n🔍 Analyzing events from 1858-1930...")
    relevant_events = analyze_events_by_year(events_data)
    print(f"Found {len(relevant_events)} relevant events")
    
    # Analyze character participation
    print(f"\n👥 Analyzing character participation...")
    participating_chars, removed_chars = analyze_character_participation(characters_data, relevant_events)
    
    print(f"\n📊 SUMMARY:")
    print(f"   - Original characters: {len(characters_data)}")
    print(f"   - Characters to keep: {len(participating_chars)}")
    print(f"   - Characters to remove: {len(removed_chars)}")
    print(f"   - Removal rate: {len(removed_chars)/len(characters_data)*100:.1f}%")
    
    # Save results
    save_results(participating_chars, removed_chars, base_path)
    
    print(f"\n✅ Analysis complete!")

if __name__ == "__main__":
    main()
