/**
 * Animation steps cho sự kiện Đà Nẵng 1858
 * File này định nghĩa các bước animation trên bản đồ
 */

export interface AnimationStep {
  time: string;
  description: string;
  action: 'ship_move' | 'explosion' | 'landing' | 'marker' | 'defense_line' | 'character_move' | 'fortification' | 'disease' | 'stalemate';
  position?: [number, number];
  targetPosition?: [number, number];
  duration?: number;
}

// Các vị trí quan trọng
export const POSITIONS = {
  // Vị trí xuất phát và di chuyển
  startPos: [16.25, 108.35] as [number, number], // Xuất phát từ biển phía Bắc
  waypoint1: [16.20, 108.32] as [number, number], // Waypoint 1
  waypoint2: [16.15, 108.28] as [number, number], // Waypoint 2
  
  // Các mục tiêu chính
  sonTraPos: [16.1219, 108.2193] as [number, number], // Sơn Trà (16°07'18.8"N 108°13'09.3"E)
  cuaHanWaypoint: [16.08, 108.225] as [number, number], // Waypoint tiến vào cửa Hàn
  thanhDienHai: [16.0617, 108.2217] as [number, number], // Thành Điện Hải - 24 Trần Phú
  donAnHai: [16.0596, 108.2308] as [number, number], // Đồn An Hải (16°03'34.6"N 108°13'50.7"E)
  daNangPos: [16.0755, 108.2240] as [number, number], // Cửa Hàn
  
  // Các tuyến phòng thủ
  phuocNinhThanhKhe: [16.065056, 108.206778] as [number, number], // Phước Ninh - Thanh Khê (16°03'54.2"N 108°12'42.4"E)
  camLePos: [15.999944, 108.180083] as [number, number], // Cẩm Lệ (15°59'59.8"N 108°10'48.3"E)
  hoaVangPos: [15.965944, 108.211028] as [number, number], // Hòa Vang (15°57'57.4"N 108°12'39.7"E)
  hoaKhanhHoaMinh: [16.029417, 108.143166] as [number, number], // Hòa Khánh - Hòa Minh
  
  // Vị trí khác
  quanBenh: [16.07, 108.24] as [number, number], // Khu vực quân Pháp bị bệnh
  nguyenTriPhuongStart: [15.90, 108.0] as [number, number], // Vị trí xuất phát Nguyễn Tri Phương
};

export const daNang1858AnimationSteps: AnimationStep[] = [
  // Bước 1a: Hạm đội tiến vào (phần 1)
  {
    time: 'Đêm 31/8 rạng 1/9/1858',
    description: 'Hạm đội liên quân Pháp-Tây Ban Nha từ ngoài biển tiến vào',
    action: 'ship_move',
    position: POSITIONS.startPos,
    targetPosition: POSITIONS.waypoint1,
    duration: 2000,
  },
  
  // Bước 1b: Tiếp tục vào (phần 2)
  {
    time: 'Đêm 31/8 rạng 1/9/1858',
    description: 'Hạm đội tiếp tục tiến vào vùng biển Sơn Trà',
    action: 'ship_move',
    position: POSITIONS.waypoint1,
    targetPosition: POSITIONS.waypoint2,
    duration: 2000,
  },
  
  // Bước 1c: Tiến đến vị trí tấn công
  {
    time: 'Đêm 31/8 rạng 1/9/1858',
    description: 'Hạm đội áp sát cửa Hàn, chuẩn bị tấn công',
    action: 'ship_move',
    position: POSITIONS.waypoint2,
    targetPosition: POSITIONS.sonTraPos,
    duration: 2000,
  },
  
  // Bước 2: Pháo nổ
  {
    time: '1/9/1858 - Sáng sớm',
    description: 'Mở bắn dữ dội vào các pháo đài cửa Hàn',
    action: 'explosion',
    position: POSITIONS.sonTraPos,
  },
  
  // Bước 3: Đổ bộ Sơn Trà
  {
    time: '1/9/1858 - Trưa',
    description: 'Đánh chiếm bán đảo Sơn Trà, khống chế luồng sông Hàn. Liên quân đổ bộ, dựng căn cứ Tourane',
    action: 'landing',
    position: POSITIONS.sonTraPos,
  },
  
  // Bước 4a: Tiến từ Sơn Trà vào cửa Hàn
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Hạm đội tiến từ Sơn Trà vào cửa sông Hàn',
    action: 'ship_move',
    position: POSITIONS.sonTraPos,
    targetPosition: POSITIONS.cuaHanWaypoint,
    duration: 2500,
  },
  
  // Bước 4b: Tiến đến Thành Điện Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Tiến đến Thành Điện Hải (bờ Tây sông Hàn)',
    action: 'ship_move',
    position: POSITIONS.cuaHanWaypoint,
    targetPosition: POSITIONS.thanhDienHai,
    duration: 2500,
  },
  
  // Bước 4c: Pháo kích Thành Điện Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Pháo kích dữ dội vào Thành Điện Hải - công sự trọng yếu nhất bảo vệ cửa sông',
    action: 'explosion',
    position: POSITIONS.thanhDienHai,
  },
  
  // Bước 4d: Chiếm Thành Điện Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Đánh chiếm Thành Điện Hải (24 Trần Phú), khống chế bờ Tây sông Hàn',
    action: 'landing',
    position: POSITIONS.thanhDienHai,
  },
  
  // Bước 4e: Tiến sang Đồn An Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Hạm đội tiến sang bờ Đông sông Hàn, tấn công Đồn An Hải',
    action: 'ship_move',
    position: POSITIONS.thanhDienHai,
    targetPosition: POSITIONS.donAnHai,
    duration: 2000,
  },
  
  // Bước 4f: Pháo kích Đồn An Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Pháo kích Đồn An Hải - công sự bờ Đông đối xứng với Điện Hải',
    action: 'explosion',
    position: POSITIONS.donAnHai,
  },
  
  // Bước 4g: Chiếm Đồn An Hải
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Đánh chiếm Đồn An Hải, hoàn thành "gọng kìm" hai bên sông Hàn, khống chế hoàn toàn cửa Hàn',
    action: 'landing',
    position: POSITIONS.donAnHai,
  },
  
  // Bước 5a: Quân triều đình rút lui
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Quân triều đình rút khỏi khu cửa Hàn, tránh đối đầu trực diện với hỏa lực hải quân Pháp',
    action: 'character_move',
    position: POSITIONS.daNangPos,
    targetPosition: POSITIONS.phuocNinhThanhKhe,
    duration: 2500,
  },
  
  // Bước 5b: Lập tuyến Phước Ninh - Thanh Khê
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Lập tuyến phòng thủ vòng ngoài tại Phước Ninh - Thanh Khê, sát trung tâm Đà Nẵng',
    action: 'defense_line',
    position: POSITIONS.phuocNinhThanhKhe,
  },
  
  // Bước 5c: Lập tuyến Cẩm Lệ
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Lập tuyến phòng thủ giữa tại Cẩm Lệ (khu Cầu Đỏ, Hòa Phát, Hòa Thọ Tây), ngăn quân Pháp tiến về nam',
    action: 'defense_line',
    position: POSITIONS.camLePos,
  },
  
  // Bước 5d: Lập tuyến Hòa Vang
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Lập tuyến phòng thủ chính tại Hòa Vang (Hòa Khánh, Hòa Phước, Hòa Phong, Hòa Châu) - nơi sẽ đặt đại bản doanh',
    action: 'fortification',
    position: POSITIONS.hoaVangPos,
  },
  
  // Bước 5e: Lập đồn sườn tây
  {
    time: 'Đầu-giữa 9/1858',
    description: 'Thiết lập đồn Hòa Khánh - Hòa Minh bảo vệ sườn tây. Hoàn thành 4 khu phòng thủ, tạo thế "vây lỏng – tiêu hao"',
    action: 'defense_line',
    position: POSITIONS.hoaKhanhHoaMinh,
  },
  
  // Bước 6: Nguyễn Tri Phương đến
  {
    time: 'Cuối 9 → 10/1858',
    description: 'Nguyễn Tri Phương ra Đà Nẵng, đặt đại bản doanh tại Hòa Vang, tổ chức lại phòng thủ',
    action: 'character_move',
    position: POSITIONS.nguyenTriPhuongStart,
    targetPosition: POSITIONS.hoaVangPos,
    duration: 3500,
  },
  
  // Bước 7: Đắp lũy phòng thủ
  {
    time: 'Cuối 9 → 10/1858',
    description: 'Đắp lũy tại Hòa Vang, chặn đường tiếp tế, không cho liên quân mở rộng vào nội địa Quảng Nam',
    action: 'fortification',
    position: POSITIONS.hoaVangPos,
  },
  
  // Bước 8: Quân Pháp bị bệnh
  {
    time: 'Cuối 1858',
    description: 'Chiến sự sa lầy. Bệnh tật (sốt rét, dịch đường ruột) quật mạnh quân viễn chinh',
    action: 'disease',
    position: POSITIONS.quanBenh,
  },
  
  // Bước 9: Kết quả
  {
    time: 'Cuối 1858',
    description: 'Liên quân giữ được đầu cầu ven biển nhưng không phá nổi phòng tuyến. Thương vong do bệnh cao hơn giao chiến',
    action: 'stalemate',
    position: POSITIONS.daNangPos,
  },
];
