"use client"

import "leaflet/dist/leaflet.css"
import { MapContainer, TileLayer } from "react-leaflet"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
// @ts-ignore
import HeatmapLayer from "react-leaflet-heatmap-layer-v3"

const pontos = [
  { lat: -8.01, lng: -34.855, value: 0.9 },
  { lat: -7.99, lng: -34.84, value: 0.3 },
  { lat: -8.02, lng: -34.88, value: 0.6 },
]

export function MapaHeatmap() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Calor de Risco</CardTitle>
      </CardHeader>

      <CardContent className="h-[420px]">
        <MapContainer
          center={[-8.01, -34.855]}
          zoom={13}
          className="h-full w-full rounded-md"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <HeatmapLayer
            points={pontos}
            longitudeExtractor={(p: any) => p.lng}
            latitudeExtractor={(p: any) => p.lat}
            intensityExtractor={(p: any) => p.value}
          />
        </MapContainer>
      </CardContent>
    </Card>
  )
}
