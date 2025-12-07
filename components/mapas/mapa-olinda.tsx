"use client"

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

type BairroRisco = {
  nome: string
  lat: number
  lng: number
  risco: number  // 0–100
}

const bairros: BairroRisco[] = [
  { nome: "Varadouro", lat: -8.0105, lng: -34.8559, risco: 82 },
  { nome: "Bairro Novo", lat: -7.9958, lng: -34.8408, risco: 35 },
  { nome: "Peixinhos", lat: -8.0163, lng: -34.8929, risco: 67 },
  { nome: "Jardim Atlântico", lat: -7.9905, lng: -34.8282, risco: 22 },
]

function corPorRisco(risco: number) {
  // verde → amarelo → laranja → vermelho
  const r = Math.min(255, Math.floor((risco / 100) * 255))
  const g = Math.min(255, Math.floor((1 - risco / 100) * 200))
  const b = 60
  return `rgb(${r}, ${g}, ${b})`
}

export function MapaOlinda() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Risco — Olinda (simulação ilustrativa)</CardTitle>
      </CardHeader>

      <CardContent className="h-[420px]">
        <MapContainer
          center={[-8.01, -34.855]}
          zoom={13}
          scrollWheelZoom={false}
          className="h-full w-full rounded-md overflow-hidden"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {bairros.map((b) => (
            <CircleMarker
              key={b.nome}
              center={[b.lat, b.lng]}
              radius={10 + b.risco * 0.12}
              pathOptions={{
                color: corPorRisco(b.risco),
                fillColor: corPorRisco(b.risco),
                fillOpacity: 0.55,
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div className="text-xs space-y-1">
                  <strong>{b.nome}</strong>
                  <br />
                  Risco: {b.risco}%
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </CardContent>
    </Card>
  )
}
