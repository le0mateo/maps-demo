
// locations.service.ts
import { Injectable } from '@angular/core';
import { Location } from './location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private locations: Location[] = [
    // Hà Nội và lân cận
    {
      id: 1,
      name: 'Hồ Hoàn Kiếm',
      latitude: 21.0285,
      longitude: 105.8542,
      description: 'Hồ nước nổi tiếng ở trung tâm Hà Nội',
      category: 'historical'
    },
    {
      id: 2,
      name: 'Văn Miếu - Quốc Tử Giám',
      latitude: 21.0293,
      longitude: 105.8353,
      description: 'Trường đại học đầu tiên của Việt Nam',
      category: 'historical'
    },
    {
      id: 3,
      name: 'Chùa Một Cột',
      latitude: 21.0358,
      longitude: 105.8333,
      description: 'Ngôi chùa biểu tượng của Hà Nội',
      category: 'historical'
    },
    {
      id: 4,
      name: 'Lăng Chủ tịch Hồ Chí Minh',
      latitude: 21.0367,
      longitude: 105.8346,
      description: 'Công trình lưu niệm Chủ tịch Hồ Chí Minh',
      category: 'historical'
    },
    {
      id: 5,
      name: 'Phố cổ Hà Nội',
      latitude: 21.0338,
      longitude: 105.8500,
      description: 'Khu phố cổ 36 phố phường',
      category: 'cultural'
    },

    // Vịnh Hạ Long và vùng lân cận
    {
      id: 6,
      name: 'Vịnh Hạ Long',
      latitude: 20.9101,
      longitude: 107.1839,
      description: 'Di sản thiên nhiên thế giới UNESCO',
      category: 'nature'
    },
    {
      id: 7,
      name: 'Đảo Cát Bà',
      latitude: 20.7244,
      longitude: 107.0478,
      description: 'Quần đảo xinh đẹp ở Hải Phòng',
      category: 'nature'
    },
    {
      id: 8,
      name: 'Bãi biển Tuần Châu',
      latitude: 20.9284,
      longitude: 106.9872,
      description: 'Bãi biển nhân tạo trên đảo Tuần Châu',
      category: 'beach'
    },
    {
      id: 9,
      name: 'Hang Sửng Sốt',
      latitude: 20.9039,
      longitude: 107.0478,
      description: 'Hang động đẹp nhất vịnh Hạ Long',
      category: 'nature'
    },

    // Miền Trung
    {
      id: 10,
      name: 'Phố cổ Hội An',
      latitude: 15.8801,
      longitude: 108.3265,
      description: 'Phố cổ xinh đẹp ở Quảng Nam',
      category: 'cultural'
    },
    {
      id: 11,
      name: 'Bãi biển Mỹ Khê',
      latitude: 16.0544,
      longitude: 108.2479,
      description: 'Một trong những bãi biển đẹp nhất Việt Nam',
      category: 'beach'
    },
    {
      id: 12,
      name: 'Ngũ Hành Sơn',
      latitude: 16.0004,
      longitude: 108.2631,
      description: 'Danh thắng nổi tiếng ở Đà Nẵng',
      category: 'nature'
    },
    {
      id: 13,
      name: 'Bà Nà Hills',
      latitude: 15.9977,
      longitude: 107.9877,
      description: 'Khu du lịch với Cầu Vàng nổi tiếng',
      category: 'cultural'
    },
    {
      id: 14,
      name: 'Cố đô Huế',
      latitude: 16.4637,
      longitude: 107.5909,
      description: 'Kinh đô của triều Nguyễn',
      category: 'historical'
    },
    {
      id: 15,
      name: 'Động Phong Nha',
      latitude: 17.5850,
      longitude: 106.2816,
      description: 'Hang động kỳ vĩ ở Quảng Bình',
      category: 'nature'
    },

    // Miền Nam
    {
      id: 16,
      name: 'Phố đi bộ Nguyễn Huệ',
      latitude: 10.7731,
      longitude: 106.7031,
      description: 'Trung tâm văn hóa - giải trí Sài Gòn',
      category: 'city'
    },
    {
      id: 17,
      name: 'Dinh Độc Lập',
      latitude: 10.7772,
      longitude: 106.6958,
      description: 'Di tích lịch sử ở TP.HCM',
      category: 'historical'
    },
    {
      id: 18,
      name: 'Chợ Bến Thành',
      latitude: 10.7721,
      longitude: 106.6980,
      description: 'Khu chợ biểu tượng của Sài Gòn',
      category: 'cultural'
    },
    {
      id: 19,
      name: 'Đảo Phú Quốc',
      latitude: 10.2896,
      longitude: 103.9829,
      description: 'Đảo ngọc của Việt Nam',
      category: 'beach'
    },
    {
      id: 20,
      name: 'Mũi Né',
      latitude: 10.9326,
      longitude: 108.2872,
      description: 'Thiên đường resort ở Phan Thiết',
      category: 'beach'
    },

    // Tây Nguyên
    {
      id: 21,
      name: 'Hồ Xuân Hương',
      latitude: 11.9404,
      longitude: 108.4419,
      description: 'Hồ trung tâm thành phố Đà Lạt',
      category: 'nature'
    },
    {
      id: 22,
      name: 'Thác Datanla',
      latitude: 11.9083,
      longitude: 108.4429,
      description: 'Thác nước nổi tiếng ở Đà Lạt',
      category: 'nature'
    },
    {
      id: 23,
      name: 'Nhà thờ Con Gà',
      latitude: 11.9429,
      longitude: 108.4277,
      description: 'Nhà thờ cổ ở Đà Lạt',
      category: 'historical'
    },
    {
      id: 24,
      name: 'Biển Hồ',
      latitude: 13.9870,
      longitude: 108.0166,
      description: 'Hồ nước ngọt tự nhiên ở Pleiku',
      category: 'nature'
    },
    
    // Miền Bắc
    {
      id: 25,
      name: 'Sapa',
      latitude: 22.3364,
      longitude: 103.8438,
      description: 'Thị trấn trong mây ở Lào Cai',
      category: 'nature'
    },
    {
      id: 26,
      name: 'Thác Bản Giốc',
      latitude: 22.8550,
      longitude: 106.7244,
      description: 'Thác nước đẹp nhất Việt Nam',
      category: 'nature'
    },
    {
      id: 27,
      name: 'Hồ Ba Bể',
      latitude: 22.4088,
      longitude: 105.6182,
      description: 'Hồ nước ngọt lớn nhất Việt Nam',
      category: 'nature'
    },
    {
      id: 28,
      name: 'Đền Hùng',
      latitude: 21.3855,
      longitude: 105.3237,
      description: 'Di tích lịch sử tâm linh ở Phú Thọ',
      category: 'historical'
    },
    {
      id: 29,
      name: 'Mộc Châu',
      latitude: 20.8272,
      longitude: 104.6789,
      description: 'Cao nguyên xinh đẹp ở Sơn La',
      category: 'nature'
    },
    {
      id: 30,
      name: 'Tràng An',
      latitude: 20.2500,
      longitude: 105.9000,
      description: 'Di sản văn hóa và thiên nhiên thế giới',
      category: 'nature'
    }
  ];

  getLocations(): Location[] {
    return this.locations;
  }
}
