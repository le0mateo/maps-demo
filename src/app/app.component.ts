import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as L from 'leaflet';
import 'leaflet-draw'; // Import Leaflet.draw
import provincesGeoJSON from './vietnam.json';
import * as turf from '@turf/turf'; // Import Turf.js
type Position = [any, any]; // [longitude, latitude]


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  private map: L.Map | undefined;

  private initMap(): void {
    // Khởi tạo bản đồ
    console.log('TEST');
    this.map = L.map('map').setView([14.0583, 108.2772], 6);

  // Layer OpenStreetMap
    const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    });

    const locations = [
        { name: "Hà Nội", lat: 21.028511, lng: 105.804817 },
        { name: "TP.HCM", lat: 10.762622, lng: 106.660172 },
        { name: "Đà Nẵng", lat: 16.047079, lng: 108.206230 },
        { name: "Cần Thơ", lat: 10.045162, lng: 105.746857 },
        { name: "Huế", lat: 16.463713, lng: 107.590866 }
    ];
    
    // Tọa độ khu vực Tây Nguyên (polygon)
    const tnCoordinates: any = [
      [13.0, 107.5],  // Đắk Lắk
      [12.5, 107.5],  // Đắk Nông
      [14.0, 108.0],  // Gia Lai
      [14.5, 107.5],  // Kon Tum
      [12.5, 108.5],  // Lâm Đồng
    ];
    // Layer Satellite của Esri
  const satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 19,
      attribution: 'Tiles © Esri'
    }
  );

  // Layer control
  const baseMaps = {
    'Bản đồ thường': osmLayer,
    'Bản đồ vệ tinh': satelliteLayer
  };

  // Thêm layer mặc định và control vào bản đồ
  osmLayer.addTo(this.map);
  L.control.layers(baseMaps).addTo(this.map);
    // Vẽ polygon khu vực Tây Nguyên
    // const tâyNguyênPolygon = L.polygon(tnCoordinates, {
    //   color: 'green',
    //   fillColor: 'green',
    //   fillOpacity: 0.5
    // }).addTo(this.map);

    // Gắn popup cho polygon
    // tâyNguyênPolygon.bindPopup("Khu vực Tây Nguyên");

    // Thêm control vẽ (cho phép vẽ thêm polygon mới)
    const drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems, // Cho phép chỉnh sửa các đối tượng đã vẽ
      },
      draw: {
        polygon: {
          allowIntersection: true, // Ngăn các cạnh giao nhau
          showArea: true, // Hiển thị diện tích
          shapeOptions: {
            color: '#ff7800'
          }
        },
        // square: true, // Cho phép vẽ hình chữ nhật
        circle: false, // Không cho phép vẽ hình tròn
        marker: false, // Không cho phép thêm marker
        circlemarker: false // Không cho phép thêm circle marker
      }
    });
    const haiDuongIcon = L.icon({
      iconUrl: 'https://cdn-icons-png.flaticon.com/512/1865/1865269.png', // URL đến icon của bạn (nếu dùng hình ảnh)
      iconSize: [32, 32], // Kích thước icon
      iconAnchor: [16, 32], // Chân icon (vị trí gắn lên bản đồ)
      popupAnchor: [0, -32] // Vị trí popup
    });
     // Thêm marker vào Hải Dương
     const haiDuongLatLng: any = [20.9333, 106.1833]; // Tọa độ Hải Dương
     const haiDuongMarker = L.marker(haiDuongLatLng,{ icon: haiDuongIcon }).addTo(this.map);
 
     // Gắn popup cho marker Hải Dương
     haiDuongMarker.bindPopup("<b>Hải Dương</b><br>Thành phố Hải Dương, Việt Nam.");
 

    this.map.addControl(drawControl);

    // Lắng nghe sự kiện khi vẽ xong
 
    this.map.on(L.Draw.Event.CREATED, (e: any) => {
      console.log('ADD EVENT');
      const layer = e.layer; // Đối tượng vừa được vẽ
      const type = e.layerType || 'unknown'; // Loại đối tượng, mặc định là 'unknown' nếu không xác định
      console.log('Đối tượng được vẽ:', type);
      // Thêm đối tượng vào nhóm đã vẽ
      drawnItems.addLayer(layer);
      const polygon = layer.toGeoJSON(); 
      // Kiểm tra các tỉnh trong vùng vẽ
      // const provincesInPolygon: string[] = this.getProvincesInPolygon(
      //   polygon
      // );
      // console.log('Danh sách các tỉnh trong vùng:', provincesInPolygon);
      // Gắn popup cho đối tượng (nếu cần)
      // layer.bindPopup(`<b>${type.toUpperCase()} được vẽ!</b>`).openPopup();
      const coordinates = polygon.geometry.coordinates[0];
      // Gọi API hoặc xử lý dữ liệu trong khu vực đã vẽ
      this.loadDataWithinPolygon(coordinates).then((data) => {
        // Hiển thị popup với danh sách dữ liệu
        const popupContent = this.generatePopupContent(data);
        layer.bindPopup(popupContent).openPopup();
      });
      // Log thông tin GeoJSON
      console.log('Thông tin GeoJSON:', layer.toGeoJSON());

    });
  }
  // Hàm giả lập load dữ liệu trong khu vực đã vẽ
  private async loadDataWithinPolygon(coordinates: any[]): Promise<any[]> {
    // Tạo API call hoặc xử lý dữ liệu tại đây
    console.log('Loading data within polygon...');
    return new Promise((resolve) => {
      // Ví dụ dữ liệu trả về
      const sampleData = [
        { name: 'Địa điểm 1', info: 'Thông tin 1' },
        { name: 'Địa điểm 2', info: 'Thông tin 2' },
        { name: 'Địa điểm 3', info: 'Thông tin 3' }
      ];
      setTimeout(() => resolve(sampleData), 1000); // Mô phỏng độ trễ
    });
  }


  // Hàm kiểm tra các tỉnh trong vùng polygon
  private getProvincesInPolygon(drawnPolygon: any): string[] {
    const provincesInPolygon: string[] = [];

    // Duyệt qua các tỉnh trong GeoJSON
    for (const feature of provincesGeoJSON.features) {
      const coordinates: Position[][] = feature.geometry.coordinates as Position[][];
      const provincePolygon = turf.polygon(coordinates);
      const intersection = turf.intersect(drawnPolygon, provincePolygon);

      // Nếu có giao nhau, thêm tỉnh vào danh sách
      if (intersection) {
        provincesInPolygon.push(feature.properties.name);
      }
    }

    return provincesInPolygon;
  }

  // Hàm tạo nội dung popup từ dữ liệu
  private generatePopupContent(data: any[]): string {
    let content = '<b>Danh sách địa điểm:</b><ul>';
    data.forEach((item) => {
      content += `<li>${item.name}: ${item.info}</li>`;
    });
    content += '</ul>';
    return content;
  }
  ngAfterViewInit(): void {
    this.initMap();
  }
}
