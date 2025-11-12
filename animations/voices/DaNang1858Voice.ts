/**
 * Nội dung AI voice đọc cho sự kiện Đà Nẵng 1858
 * File này chứa các đoạn text mà AI sẽ đọc cho từng bước animation
 */

export interface VoiceStep {
  time: string;
  description: string;
}

/**
 * Phần giới thiệu tổng quan - đọc trước khi bắt đầu animation
 */
export const daNang1858IntroVoice = `Năm 1858, mở đầu cuộc xâm lược Việt Nam của thực dân Pháp.

Ngày mùng 1 tháng 9 năm 1858, liên quân Pháp – Tây Ban Nha nổ súng tấn công cửa Hàn, Đà Nẵng, lấy cớ triều đình nhà Nguyễn đàn áp đạo Thiên Chúa.

Tư lệnh phía Pháp là Đô đốc Rigault de Genouilly, đem theo hơn hai nghìn quân, bảy tàu chiến, cùng hỏa lực hiện đại. Quân triều đình do vua Tự Đức chỉ huy, giao Nguyễn Tri Phương trấn giữ mặt trận Đà Nẵng.

Liên quân đổ bộ chiếm bán đảo Sơn Trà, lập căn cứ Tourane, sau đó pháo kích vào thành Điện Hải và đồn An Hải hai bên bờ sông Hàn. Tuy nhiên, địa thế hiểm trở, khí hậu khắc nghiệt và sự kháng cự quyết liệt của quân dân ta khiến liên quân bị cầm chân suốt nhiều tháng. Bệnh tật lan tràn, quân số hao hụt nặng.

Trước thế sa lầy, Pháp quyết định rút bớt lực lượng ở Đà Nẵng để chuyển hướng đánh vào Nam Kỳ, nơi chúng cho là yếu hơn, mở đường cho việc chiếm thành Gia Định đầu năm 1859.

Năm 1858 vì vậy trở thành mốc khởi đầu của thời kỳ Việt Nam rơi vào vòng xâm lược và đô hộ của thực dân Pháp, mở ra gần một thế kỷ mất nước đầy biến động.`;

/**
 * Phiên bản có nhịp nhấn - đọc chậm, rõ ràng, có điểm dừng tự nhiên
 */
export const daNang1858IntroVoiceWithPacing = `Năm 1858... mở đầu cuộc xâm lược Việt Nam của thực dân Pháp.

Ngày mùng 1 tháng 9 năm 1858... liên quân Pháp – Tây Ban Nha... nổ súng tấn công cửa Hàn, Đà Nẵng... lấy cớ triều đình nhà Nguyễn đàn áp đạo Thiên Chúa.

Tư lệnh phía Pháp... là Đô đốc Rigault de Genouilly... đem theo hơn hai nghìn quân... bảy tàu chiến... cùng hỏa lực hiện đại.

Quân triều đình... do vua Tự Đức chỉ huy... giao Nguyễn Tri Phương... trấn giữ mặt trận Đà Nẵng.

Liên quân đổ bộ... chiếm bán đảo Sơn Trà... lập căn cứ Tourane... sau đó pháo kích vào thành Điện Hải... và đồn An Hải... hai bên bờ sông Hàn.

Tuy nhiên... địa thế hiểm trở... khí hậu khắc nghiệt... và sự kháng cự quyết liệt của quân dân ta... khiến liên quân bị cầm chân... suốt nhiều tháng. Bệnh tật lan tràn... quân số hao hụt nặng.

Trước thế sa lầy... Pháp quyết định rút bớt lực lượng ở Đà Nẵng... để chuyển hướng đánh vào Nam Kỳ... nơi chúng cho là yếu hơn... mở đường cho việc chiếm thành Gia Định... đầu năm 1859.

Năm 1858 vì vậy... trở thành mốc khởi đầu của thời kỳ Việt Nam rơi vào vòng xâm lược... và đô hộ của thực dân Pháp... mở ra gần một thế kỷ mất nước... đầy biến động.`;

export const daNang1858VoiceSteps: VoiceStep[] = [
  // Bước 1a: Hạm đội tiến vào (phần 1)
  {
    time: 'Đêm 31 tháng 8 rạng sáng 1 tháng 9 năm 1858',
    description: 'Hạm đội liên quân Pháp-Tây Ban Nha từ ngoài biển tiến vào',
  },
  
  // Bước 1b: Tiếp tục vào (phần 2)
  {
    time: 'Đêm 31 tháng 8 rạng sáng 1 tháng 9 năm 1858',
    description: 'Hạm đội tiếp tục tiến vào vùng biển Sơn Trà',
  },
  
  // Bước 1c: Tiến đến vị trí tấn công
  {
    time: 'Đêm 31 tháng 8 rạng sáng 1 tháng 9 năm 1858',
    description: 'Hạm đội áp sát cửa Hàn, chuẩn bị tấn công',
  },
  
  // Bước 2: Pháo nổ
  {
    time: '1 tháng 9 năm 1858 - Sáng sớm',
    description: 'Pháo hạm mở bắn dữ dội vào các pháo đài cửa Hàn',
  },
  
  // Bước 3: Đổ bộ Sơn Trà
  {
    time: '1 tháng 9 năm 1858 - Trưa',
    description: 'Liên quân đánh chiếm bán đảo Sơn Trà, khống chế luồng sông Hàn. Liên quân đổ bộ, dựng căn cứ Tourane',
  },
  
  // Bước 4a: Tiến từ Sơn Trà vào cửa Hàn
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Hạm đội tiến từ Sơn Trà vào cửa sông Hàn',
  },
  
  // Bước 4b: Tiến đến Thành Điện Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Tiến đến Thành Điện Hải, công sự bảo vệ bờ Tây sông Hàn',
  },
  
  // Bước 4c: Pháo kích Thành Điện Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Pháo kích dữ dội vào Thành Điện Hải - công sự trọng yếu nhất bảo vệ cửa sông',
  },
  
  // Bước 4d: Chiếm Thành Điện Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Đánh chiếm Thành Điện Hải tại 24 Trần Phú, khống chế bờ Tây sông Hàn',
  },
  
  // Bước 4e: Tiến sang Đồn An Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Hạm đội tiến sang bờ Đông sông Hàn, tấn công Đồn An Hải',
  },
  
  // Bước 4f: Pháo kích Đồn An Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Pháo kích Đồn An Hải - công sự bờ Đông đối xứng với Điện Hải',
  },
  
  // Bước 4g: Chiếm Đồn An Hải
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Đánh chiếm Đồn An Hải, hoàn thành gọng kìm hai bên sông Hàn, khống chế hoàn toàn cửa Hàn',
  },
  
  // Bước 5a: Quân triều đình rút lui
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Quân triều đình rút khỏi khu cửa Hàn, tránh đối đầu trực diện với hỏa lực hải quân Pháp',
  },
  
  // Bước 5b: Lập tuyến Phước Ninh - Thanh Khê
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Lập tuyến phòng thủ vòng ngoài tại Phước Ninh - Thanh Khê, sát trung tâm Đà Nẵng',
  },
  
  // Bước 5c: Lập tuyến Cẩm Lệ
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Lập tuyến phòng thủ giữa tại Cẩm Lệ, khu vực Cầu Đỏ, Hòa Phát, Hòa Thọ Tây, ngăn quân Pháp tiến về nam',
  },
  
  // Bước 5d: Lập tuyến Hòa Vang
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Lập tuyến phòng thủ chính tại Hòa Vang, bao gồm Hòa Khánh, Hòa Phước, Hòa Phong, Hòa Châu - nơi sẽ đặt đại bản doanh',
  },
  
  // Bước 5e: Lập đồn sườn tây
  {
    time: 'Đầu đến giữa tháng 9 năm 1858',
    description: 'Thiết lập đồn Hòa Khánh - Hòa Minh bảo vệ sườn tây. Hoàn thành 4 khu phòng thủ, tạo thế vây lỏng, tiêu hao',
  },
  
  // Bước 6: Nguyễn Tri Phương đến
  {
    time: 'Cuối tháng 9 đến tháng 10 năm 1858',
    description: 'Tổng đốc Nguyễn Tri Phương ra Đà Nẵng, đặt đại bản doanh tại Hòa Vang, tổ chức lại phòng thủ',
  },
  
  // Bước 7: Đắp lũy phòng thủ
  {
    time: 'Cuối tháng 9 đến tháng 10 năm 1858',
    description: 'Đắp lũy, xây pháo đài tại Hòa Vang, chặn đường tiếp tế, không cho liên quân mở rộng vào nội địa Quảng Nam',
  },
  
  // Bước 8: Quân Pháp bị bệnh
  {
    time: 'Cuối năm 1858',
    description: 'Chiến sự sa lầy. Bệnh tật như sốt rét, dịch đường ruột quật mạnh quân viễn chinh',
  },
  
  // Bước 9: Kết quả
  {
    time: 'Cuối năm 1858',
    description: 'Liên quân giữ được đầu cầu ven biển nhưng không phá nổi phòng tuyến. Thương vong do bệnh tật cao hơn giao chiến',
  },
];

/**
 * Hàm lấy nội dung voice cho một bước cụ thể
 */
export const getVoiceContent = (stepIndex: number): string => {
  if (stepIndex < 0 || stepIndex >= daNang1858VoiceSteps.length) {
    return '';
  }
  
  const step = daNang1858VoiceSteps[stepIndex];
  return `${step.time}. ${step.description}`;
};

/**
 * Hàm lấy tất cả nội dung voice
 */
export const getAllVoiceContent = (): string[] => {
  return daNang1858VoiceSteps.map((step, index) => getVoiceContent(index));
};

/**
 * Hàm lấy nội dung intro (tổng quan)
 * @param withPacing - True: phiên bản có nhịp nhấn, False: phiên bản thông thường
 */
export const getIntroVoice = (withPacing: boolean = false): string => {
  return withPacing ? daNang1858IntroVoiceWithPacing : daNang1858IntroVoice;
};

/**
 * Hàm lấy nội dung voice đầy đủ (intro + các bước)
 */
export const getFullVoiceContent = (withPacing: boolean = false): string[] => {
  return [
    getIntroVoice(withPacing),
    ...getAllVoiceContent()
  ];
};
