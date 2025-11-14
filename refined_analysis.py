#!/usr/bin/env python3
"""
Refined analysis to identify characters with DIRECT participation vs. indirect involvement
in historical events from 1858-1930.
"""

import json
import os
from collections import defaultdict

def load_json_file(filepath):
    """Load JSON file and return data"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def analyze_direct_participation(characters_data, events_data):
    """Analyze characters for direct vs indirect participation"""
    
    # Create event lookup
    events_by_id = {event['id']: event for event in events_data}
    
    # Key historical events and their direct participants (based on research)
    key_events_participants = {
        # Major resistance movements
        'event-001': ['Nguyễn Tri Phương', 'Rigault de Genouilly'],  # Da Nang attack 1858
        'event-002': ['Nguyễn Tri Phương', 'Rigault de Genouilly'],  # Gia Dinh capture 1859
        'event-008': ['Vua Hàm Nghi', 'Tôn Thất Thuyết'],  # Can Vuong movement 1885
        'event-009': ['Hoàng Hoa Thám'],  # Yen The uprising 1884
        'event-010': ['Phan Bội Châu'],  # Dong Du movement 1905
        'event-011': ['Phan Châu Trinh', 'Lương Văn Can'],  # Dong Kinh Nghia Thuc 1907
        'event-014': ['Nguyễn Ái Quốc', 'Trần Phú'],  # Communist Party founding 1930
        'event-016': ['Trương Định'],  # Go Cong resistance 1862
        'event-017': ['Nguyễn Trung Trực'],  # Nguyen Trung Truc uprising 1861
        'event-020': ['Đinh Công Tráng'],  # Ba Dinh uprising 1886
        'event-021': ['Phan Đình Phùng', 'Cao Thắng'],  # Huong Khe uprising 1885
    }
    
    # Analyze each character
    direct_participants = []
    indirect_participants = []
    
    for character in characters_data:
        char_name = character['name']
        char_events = character.get('relatedEvents', [])
        birth_year = character.get('birthYear', 0)
        death_year = character.get('deathYear', 9999)
        
        # Check for direct participation in key events
        is_direct_participant = False
        direct_events = []
        
        for event_id in char_events:
            if event_id in key_events_participants:
                # Check if this character is listed as a direct participant
                if any(name in char_name or char_name in name for name in key_events_participants[event_id]):
                    is_direct_participant = True
                    direct_events.append(event_id)
        
        # Additional criteria for direct participation
        # 1. Major historical figures with significant roles
        major_figures = [
            'Nguyễn Trung Trực', 'Trương Định', 'Phan Đình Phùng', 'Hoàng Hoa Thám',
            'Phan Bội Châu', 'Phan Châu Trinh', 'Nguyễn Ái Quốc', 'Vua Hàm Nghi',
            'Tôn Thất Thuyết', 'Đinh Công Tráng', 'Cao Thắng', 'Lương Văn Can',
            'Trần Phú', 'Nguyễn Tri Phương'
        ]
        
        # 2. Characters with multiple related events (indicating active participation)
        has_multiple_events = len(char_events) >= 3
        
        # 3. Characters who lived during key periods and have biographical evidence of direct action
        lived_during_key_period = (birth_year <= 1900 and death_year >= 1858)
        
        if (is_direct_participant or 
            any(name in char_name for name in major_figures) or
            (has_multiple_events and lived_during_key_period)):
            
            direct_participants.append({
                'character': character,
                'reason': f"Direct participant - Events: {len(char_events)}, Key events: {direct_events}"
            })
        else:
            indirect_participants.append({
                'character': character,
                'reason': f"Indirect/Minor role - Events: {len(char_events)}, Period: {birth_year}-{death_year}"
            })
    
    return direct_participants, indirect_participants

def print_analysis_results(direct_participants, indirect_participants):
    """Print detailed analysis results"""
    
    print("🎯 DIRECT PARTICIPANTS (Keep these):")
    print("=" * 60)
    for item in direct_participants:
        char = item['character']
        print(f"✓ {char['name']} ({char.get('birthYear', '?')}-{char.get('deathYear', '?')})")
        print(f"  Role: {char.get('role', 'N/A')}")
        print(f"  Events: {len(char.get('relatedEvents', []))}")
        print(f"  Reason: {item['reason']}")
        print()
    
    print(f"\n📋 INDIRECT/MINOR PARTICIPANTS (Consider removing):")
    print("=" * 60)
    for item in indirect_participants[:20]:  # Show first 20
        char = item['character']
        print(f"✗ {char['name']} ({char.get('birthYear', '?')}-{char.get('deathYear', '?')})")
        print(f"  Role: {char.get('role', 'N/A')}")
        print(f"  Reason: {item['reason']}")
        print()
    
    if len(indirect_participants) > 20:
        print(f"... and {len(indirect_participants) - 20} more")

def save_refined_results(direct_participants, indirect_participants, base_path):
    """Save refined analysis results"""
    
    # Extract just the character data
    direct_chars = [item['character'] for item in direct_participants]
    indirect_chars = [item['character'] for item in indirect_participants]
    
    # Save direct participants (main dataset)
    main_file = os.path.join(base_path, 'data', 'characters_main_figures.json')
    with open(main_file, 'w', encoding='utf-8') as f:
        json.dump(direct_chars, f, ensure_ascii=False, indent=2)
    
    # Save indirect participants (secondary dataset)
    secondary_file = os.path.join(base_path, 'data', 'characters_secondary_figures.json')
    with open(secondary_file, 'w', encoding='utf-8') as f:
        json.dump(indirect_chars, f, ensure_ascii=False, indent=2)
    
    # Create analysis report
    report_file = os.path.join(base_path, 'data', 'character_analysis_report.txt')
    with open(report_file, 'w', encoding='utf-8') as f:
        f.write("CHARACTER ANALYSIS REPORT - VIETNAM 1858-1930\n")
        f.write("=" * 50 + "\n\n")
        f.write(f"Total characters analyzed: {len(direct_participants) + len(indirect_participants)}\n")
        f.write(f"Direct participants (main figures): {len(direct_participants)}\n")
        f.write(f"Indirect participants (secondary): {len(indirect_participants)}\n\n")
        
        f.write("DIRECT PARTICIPANTS:\n")
        f.write("-" * 20 + "\n")
        for item in direct_participants:
            char = item['character']
            f.write(f"{char['name']} ({char.get('birthYear', '?')}-{char.get('deathYear', '?')})\n")
            f.write(f"  {item['reason']}\n\n")
    
    print(f"\n📁 Files saved:")
    print(f"   - Main figures: {main_file}")
    print(f"   - Secondary figures: {secondary_file}")
    print(f"   - Analysis report: {report_file}")

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
    
    # Perform refined analysis
    print("\n🔍 Performing refined analysis for direct vs indirect participation...")
    direct_participants, indirect_participants = analyze_direct_participation(characters_data, events_data)
    
    # Print results
    print_analysis_results(direct_participants, indirect_participants)
    
    print(f"\n📊 REFINED SUMMARY:")
    print(f"   - Total characters: {len(characters_data)}")
    print(f"   - Direct participants (keep): {len(direct_participants)}")
    print(f"   - Indirect participants (consider removing): {len(indirect_participants)}")
    print(f"   - Recommended removal rate: {len(indirect_participants)/len(characters_data)*100:.1f}%")
    
    # Save results
    save_refined_results(direct_participants, indirect_participants, base_path)
    
    print(f"\n✅ Refined analysis complete!")

if __name__ == "__main__":
    main()
