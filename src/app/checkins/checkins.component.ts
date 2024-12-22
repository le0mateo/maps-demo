import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.heat';
import 'leaflet.markercluster';
import 'leaflet.heat';
// import { MarkerClusterGroup } from 'leaflet.markercluster';

import { LocationsService } from './location.services';
import { Location } from './location.model';
const heatData = [
  [21.028511, 105.804817, 0.8],  // Hà Nội
  [10.762622, 106.660172, 0.9],  // TP.HCM
  [16.047079, 108.206230, 0.6],  // Đà Nẵng
  [10.045162, 105.746857, 0.4],  // Cần Thơ
  [20.844911, 106.688084, 0.5],  // Hải Phòng
];

@Component({
  selector: 'app-checkins',
  templateUrl: './checkins.component.html',
  styleUrl: './checkins.component.scss'
})
export class CheckinsComponent {
  private map!: L.Map;
  private markerClusterGroup!: L.MarkerClusterGroup;
  locations: Location[] = [];
  filteredLocations: Location[] = [];
  private markers: L.Marker[] = [];
  private scrollPosition = 0;
  private scrolling = false;
  categories = ['all', 'historical', 'nature', 'cultural', 'beach', 'city'];
  selectedCategory: string = 'all';
  selectedClusterLocations: Location[] = [];
  private vietnamBoundary!: L.GeoJSON;
  private heatmapLayer!: L.HeatLayer;
  showHeatmap: boolean = true;
  showMarkers: boolean = true;

  constructor(private locationsService: LocationsService) {}

  ngOnInit() {
    this.locations = this.locationsService.getLocations();
    this.filteredLocations = this.locations;
  }

  ngAfterViewInit() {
    this.initMap();
  
    this.initMarkerClusterGroup();
      this.addMarkers();
      this.addHeatmap();
    this.startAutoScroll();
    console.log('RUN CHECKINS');
  }

  private getMarkerIcon(category: string): L.DivIcon {
    // const iconSize: L.PointTuple = [32, 32];
    // const iconAnchor: L.PointTuple = [16, 32];
    // const popupAnchor: L.PointTuple = [0, -32];

    // const iconUrls: { [key: string]: string } = {
    //   historical: 'assets/icons/historic-site.png',
    //   nature: 'assets/icons/green-areas.png',
    //   cultural: 'assets/icons/cultural.png',
    //   beach: 'assets/icons/beach-umbrella.png',
    //   city: 'assets/icons/location.png'
    // };

    // return L.icon({
    //   iconUrl: iconUrls[category] || 'assets/icons/default-marker.svg',
    //   iconSize,
    //   iconAnchor,
    //   popupAnchor
    // });
    const markerColors: { [key: string]: string } = {
      historical: '#dc3545',
      nature: '#28a745',
      cultural: '#ffc107',
      beach: '#17a2b8',
      city: '#6c757d'
    };
  
    const color = markerColors[category] || markerColors['city'];
  
    return L.divIcon({
      className: `custom-marker category-${category}`,
      html: `
        <div class="marker-container">
          <div class="pulse" style="background: ${color}"></div>
          <div class="marker" style="background: ${color}">
            <i class="${this.getCategoryIcon(category)}"></i>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([16.0, 106.0], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors X'
    }).addTo(this.map);

    // this.addVietnamBoundary();
    // const heat = L.heatLayer(heatData, {
    //   radius: 25,
    //   blur: 15, 
    //   maxZoom: 17,
    //   max: 1
    // }).addTo(this.map);
  }

  private addHeatmap(): void {
    // Convert locations to heatmap points
    const heatmapPoints = this.locations.map(location => {
      // Tính trọng số dựa trên category
      let intensity = 1;
      switch (location.category) {
        case 'historical':
          intensity = 1.2;
          break;
        case 'nature':
          intensity = 1.0;
          break;
        case 'cultural':
          intensity = 1.1;
          break;
        case 'beach':
          intensity = 0.9;
          break;
        case 'city':
          intensity = 1.3;
          break;
      }
      
      return [
        location.latitude,
        location.longitude,
        intensity
      ] as [number, number, number];
    });

    // Create heatmap layer with custom options
    this.heatmapLayer = L.heatLayer(heatmapPoints, {
      radius: 25,             // Bán kính của mỗi điểm
      blur: 15,              // Độ mờ
      maxZoom: 10,           // Mức zoom tối đa cho heatmap
      max: 1.3,             // Giá trị cường độ tối đa
      gradient: {           // Tùy chỉnh gradient màu
        0.0: '#313695',     // Xanh đậm cho mật độ rất thấp
        0.2: '#4575b4',     // Xanh dương cho mật độ thấp
        0.4: '#74add1',     // Xanh nhạt cho mật độ trung bình thấp
        0.6: '#fed976',     // Vàng cho mật độ trung bình
        0.8: '#feb24c',     // Cam cho mật độ cao
        1.0: '#f03b20'      // Đỏ cho mật độ rất cao
      }
    });

    if (this.showHeatmap) {
      this.heatmapLayer.addTo(this.map);
    }
  }


  private addVietnamBoundary(): void {
    // GeoJSON cho đường biên giới Việt Nam (simplified version)
    const vietnamGeoJSON = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [102.14450073242188, 22.40051269438026],
          [103.89678955078125, 21.325993626667396],
          [106.12335205078125, 20.35449393938644],
          [107.57873535156249, 21.207458727336446],
          [108.23974609375, 21.166483858206583],
          [109.27368164062499, 20.097206227083888],
          [109.44580078125, 19.00911161011606],
          [109.24072265625, 17.978733095556155],
          [108.55712890625, 16.72969837561712],
          [107.490234375, 16.467694748288956],
          [107.27111816406249, 15.982453522973533],
          [108.12377929687499, 15.542476537103689],
          [108.88427734375, 14.974829413352242],
          [109.27368164062499, 13.410994034321702],
          [109.229736328125, 12.382928338487396],
          [109.11376953125, 11.794251601676497],
          [108.79638671875, 11.113727282172743],
          [106.87286376953125, 10.833305983642491],
          [106.34033203125, 10.012129557942001],
          [105.99096679687499, 9.709057068618208],
          [104.86572265625, 9.622414142924805],
          [104.19372558593749, 10.314919285425242],
          [103.95996093749999, 10.487811882056683],
          [103.27697753906249, 11.178401873711785],
          [102.89856910705566, 13.379906055295653],
          [102.10155487060547, 14.457013423214262],
          [102.14450073242188, 22.40051269438026]
        ]]
      }
    };

    // Style cho Vietnam boundary
    const boundaryStyle = {
      color: '#FF4136',        // Màu viền đỏ
      weight: 2,               // Độ dày viền
      opacity: 0.8,           // Độ trong suốt của viền
      fillColor: '#FF4136',    // Màu fill
      fillOpacity: 0.1        // Độ trong suốt của fill
    };

    // Thêm overlay cho các vùng lân cận
    const surroundingStyle = {
      color: '#666',
      weight: 1,
      opacity: 0.5,
      fillColor: '#666',
      fillOpacity: 0.2
    };

    // Tạo rectangle cho vùng xung quanh
    const surroundingBounds = L.latLngBounds(
      L.latLng(5.0, 95.0),    // Southwest
      L.latLng(24.0, 120.0)   // Northeast
    );
    L.rectangle(surroundingBounds, surroundingStyle).addTo(this.map);

    // Thêm Vietnam boundary với style đã định nghĩa
    this.vietnamBoundary = L.geoJSON(vietnamGeoJSON as any, {
      style: boundaryStyle
    }).addTo(this.map);

    // Thêm effect hover cho Vietnam boundary
    this.vietnamBoundary.on('mouseover', (e) => {
      const layer = e.target;
      layer.setStyle({
        fillOpacity: 0.2,
        weight: 3
      });
    });

    this.vietnamBoundary.on('mouseout', (e) => {
      this.vietnamBoundary.setStyle(boundaryStyle);
    });
  }

  private initMarkerClusterGroup(): void {
    this.markerClusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      removeOutsideVisibleBounds: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let size = 'small';
        
        if (count > 10) size = 'medium';
        if (count > 20) size = 'large';
        
        return L.divIcon({
          html: `<div class="cluster-icon cluster-${size}">${count}</div>`,
          className: `marker-cluster marker-cluster-${size}`,
          iconSize: L.point(40, 40)
        });
      }
    });
   
    // Add click event handler for clusters
    this.markerClusterGroup.on('clusterclick', (e) => {
      const cluster = e.layer;
      const markers = cluster.getAllChildMarkers();
      
      // Get locations from markers
      this.selectedClusterLocations = markers.map((marker: L.Marker) => {
        const latLng = marker.getLatLng();
        return this.locations.find(loc => 
          loc.latitude === latLng.lat && 
          loc.longitude === latLng.lng
        )!;
      });
    });
    
    // Add click event handler for map
    this.map.on('click', () => {
      this.clearSelectedCluster();
    });

    this.map.addLayer(this.markerClusterGroup);
  }

  private addMarkers(): void {
    // Clear existing markers
  this.markerClusterGroup.clearLayers();
  this.markers = [];

  this.locations.forEach(location => {
    const marker = L.marker(
      [location.latitude, location.longitude],
      { 
        icon: this.getMarkerIcon(location.category),
        riseOnHover: true,
        riseOffset: 250
      }
    )
    .bindPopup(`
      <div class="custom-popup">
        <h3>${location.name}</h3>
        <p>${location.description}</p>
      </div>
    `)
    .on('mouseover', function(e) {
      const markerElement = e.target.getElement();
      const pulseElement = markerElement.querySelector('.pulse');
      if (pulseElement) {
        pulseElement.style.animationDuration = '0.8s';
      }
    })
    .on('mouseout', function(e) {
      const markerElement = e.target.getElement();
      const pulseElement = markerElement.querySelector('.pulse');
      if (pulseElement) {
        pulseElement.style.animationDuration = '1.5s';
      }
    })
    .on('click', () => {
      const markerElement : any = marker.getElement();
      const pulseElement = markerElement.querySelector('.pulse');
      if (pulseElement) {
        // Tạm dừng animation khi click
        pulseElement.style.animationPlayState = 'paused';
        setTimeout(() => {
          pulseElement.style.animationPlayState = 'running';
        }, 1000);
      }
    });
    
    this.markers.push(marker);
    this.markerClusterGroup.addLayer(marker);
  });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filteredLocations = category === 'all' 
      ? this.locations 
      : this.locations.filter(loc => loc.category === category);
    
    // Update markers visibility
    this.markerClusterGroup.clearLayers();
    
    this.markers.forEach((marker, index) => {
      const location = this.locations[index];
      if (category === 'all' || location.category === category) {
        this.markerClusterGroup.addLayer(marker);
      }
    });

    // Update heatmap for filtered locations
    if (this.heatmapLayer) {
      this.map.removeLayer(this.heatmapLayer);
      const filteredPoints = this.filteredLocations.map(location => {
        let intensity = 1;
        switch (location.category) {
          case 'historical': intensity = 1.2; break;
          case 'nature': intensity = 1.0; break;
          case 'cultural': intensity = 1.1; break;
          case 'beach': intensity = 0.9; break;
          case 'city': intensity = 1.3; break;
        }
        return [location.latitude, location.longitude, intensity] as [number, number, number];
      });
      
      this.heatmapLayer = L.heatLayer(filteredPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        max: 1.3,
        gradient: {
          0.0: '#87CEEB',
          0.3: '#66CDAA',
          0.5: '#FFD700',
          0.7: '#FFA07A',
          1.0: '#FF4500'
        }
      });
      
      if (this.showHeatmap) {
        this.heatmapLayer.addTo(this.map);
      }
    }
  }

  toggleHeatmap(): void {
    this.showHeatmap = !this.showHeatmap;
    if (this.showHeatmap) {
      this.heatmapLayer.addTo(this.map);
    } else {
      this.map.removeLayer(this.heatmapLayer);
    }
  }

  toggleMarkers(): void {
    this.showMarkers = !this.showMarkers;
    if (this.showMarkers) {
      this.map.addLayer(this.markerClusterGroup);
    } else {
      this.map.removeLayer(this.markerClusterGroup);
    }
  }
  

  clearSelectedCluster(): void {
    this.selectedClusterLocations = [];
  }

  zoomToLocation(location: Location): void {
    this.map.setView([location.latitude, location.longitude], 14);
    const marker = this.markers.find(m => 
      m.getLatLng().lat === location.latitude && 
      m.getLatLng().lng === location.longitude
    );
    if (marker) {
      this.markerClusterGroup.zoomToShowLayer(marker, () => {
        marker.openPopup();
        this.clearSelectedCluster();
      });
    }
  }

  // private addMarkers(): void {
  //   // Clear existing markers
  //   this.markers.forEach(marker => marker.remove());
  //   this.markers = [];

  //   this.locations.forEach(location => {
  //     const marker = L.marker(
  //       [location.latitude, location.longitude],
  //       { icon: this.getMarkerIcon(location.category) }
  //     )
  //       .bindPopup(`
  //         <div class="custom-popup">
  //           <h3>${location.name}</h3>
  //           <p>${location.description}</p>
  //         </div>
  //       `)
  //       .addTo(this.map);
  //     this.markers.push(marker);
  //   });
  // }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      all: 'Tất cả',
      historical: 'Di tích',
      nature: 'Thiên nhiên',
      cultural: 'Văn hóa',
      beach: 'Biển',
      city: 'Thành phố'
    };
    return labels[category] || category;
  }

  getCategoryIcon(category: string): string {
    const icons: { [key: string]: string } = {
      historical: 'fas fa-landmark',
      nature: 'fas fa-tree',
      cultural: 'fas fa-theater-masks',
      beach: 'fas fa-umbrella-beach',
      city: 'fas fa-city'
    };
    return icons[category] || 'fas fa-map-marker-alt';
  }

  // filterByCategory(category: string): void {
  //   this.selectedCategory = category;
  //   this.filteredLocations = category === 'all' 
  //     ? this.locations 
  //     : this.locations.filter(loc => loc.category === category);
    
  //   // Update markers visibility
  //   this.markers.forEach((marker, index) => {
  //     const location = this.locations[index];
  //     if (category === 'all' || location.category === category) {
  //       marker.addTo(this.map);
  //     } else {
  //       marker.remove();
  //     }
  //   });
  // }

  // zoomToLocation(location: Location): void {
  //   console.log('HERE');
  //   this.map.flyTo([location.latitude, location.longitude], 10, { animate: true,duration: 1 });
  //   const marker = this.markers.find(m => 
  //     m.getLatLng().lat === location.latitude && 
  //     m.getLatLng().lng === location.longitude
  //   );
  //   if (marker) {
  //     marker.openPopup();
  //   }
  // }

  private startAutoScroll(): void {
    const scrollContainer = document.querySelector('.locations-scroll');
    if (!scrollContainer) return;

    setInterval(() => {
      if (this.scrolling) return;

      const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      this.scrollPosition += 1;

      if (this.scrollPosition >= maxScroll) {
        this.scrollPosition = 0;
      }

      scrollContainer.scrollTop = this.scrollPosition;
    }, 50);

    scrollContainer.addEventListener('mouseenter', () => {
      this.scrolling = true;
    });

    scrollContainer.addEventListener('mouseleave', () => {
      this.scrolling = false;
    });
  }
}
