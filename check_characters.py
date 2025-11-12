import json

# Đọc file events.json
with open('data/events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

# Lọc sự kiện từ 1858-1900
events_1858_1900 = [e for e in events if 1858 <= e['date']['year'] <= 1900]

# Tìm sự kiện thiếu nhân vật
missing = []
for e in events_1858_1900:
    if not e.get('relatedCharacters') or len(e['relatedCharacters']) == 0:
        missing.append({
            'id': e['id'],
            'year': e['date']['year'],
            'name': e['name']
        })

# In kết quả
print(f'=== KIỂM TRA SỰ KIỆN 1858-1900 ===\n')
print(f'Tổng số sự kiện: {len(events_1858_1900)}')
print(f'Số sự kiện thiếu nhân vật: {len(missing)}\n')

if missing:
    print('DANH SÁCH SỰ KIỆN THIẾU NHÂN VẬT:\n')
    for item in sorted(missing, key=lambda x: x['year']):
        print(f'{item["id"]} ({item["year"]}): {item["name"]}')
else:
    print('✅ TẤT CẢ SỰ KIỆN ĐÃ CÓ NHÂN VẬT!')
