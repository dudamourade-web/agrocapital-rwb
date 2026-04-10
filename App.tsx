import React, { useMemo, useState } from "react";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

type Lead = {
  id: number;
  nome: string;
  regiao: string;
  latitude: number;
  longitude: number;
  hectares: number;
  cabecas: number;
  perfil: string;
  ticket: number;
  score: number;
  status: string;
  contato: string;
  observacao: string;
};

const baseLeads: Omit<Lead, "id">[] = [
  {
    nome: "Fazenda Santa Helena",
    regiao: "Cáceres",
    latitude: -16.07,
    longitude: -57.68,
    hectares: 15000,
    cabecas: 22000,
    perfil: "Extensivo",
    ticket: 12,
    score: 74,
    status: "Mapeado",
    contato: "Diretor Operacional",
    observacao: "Potencial claro para intensificação e crédito estruturado.",
  },
  {
    nome: "Agropecuária Araguaia Norte",
    regiao: "São Félix do Araguaia",
    latitude: -11.62,
    longitude: -50.67,
    hectares: 20000,
    cabecas: 30000,
    perfil: "Extensivo",
    ticket: 18,
    score: 81,
    status: "Em estruturação",
    contato: "Sócio-proprietário",
    observacao: "Escala robusta em polo estratégico para expansão e giro.",
  },
  {
    nome: "Fazenda Boa Esperança",
    regiao: "Querência",
    latitude: -12.6,
    longitude: -52.2,
    hectares: 12000,
    cabecas: 18000,
    perfil: "ILP",
    ticket: 10,
    score: 78,
    status: "Mapeado",
    contato: "Gerente Financeiro",
    observacao: "Boa aderência para tese de produtividade e integração.",
  },
  {
    nome: "Grupo Vale Verde",
    regiao: "Sinop",
    latitude: -11.86,
    longitude: -55.5,
    hectares: 18000,
    cabecas: 25000,
    perfil: "Confinamento",
    ticket: 20,
    score: 89,
    status: "Em diligência",
    contato: "CFO Agro",
    observacao: "Governança superior e perfil premium para investidor.",
  },
  {
    nome: "Agro Xingu Prime",
    regiao: "Gaúcha do Norte",
    latitude: -13.22,
    longitude: -53.25,
    hectares: 16000,
    cabecas: 21000,
    perfil: "ILP",
    ticket: 14,
    score: 80,
    status: "Em estruturação",
    contato: "Head de Expansão",
    observacao: "Produtor moderno com narrativa forte de crescimento.",
  },
  {
    nome: "Fazenda Nova Era",
    regiao: "Vila Bela da Santíssima Trindade",
    latitude: -15.0,
    longitude: -59.95,
    hectares: 22000,
    cabecas: 35000,
    perfil: "Extensivo",
    ticket: 25,
    score: 84,
    status: "Mapeado",
    contato: "Família controladora",
    observacao: "Escala muito alta; ideal para capital em fases.",
  },
  {
    nome: "Grupo Pantanal Beef",
    regiao: "Cáceres",
    latitude: -16.1,
    longitude: -57.6,
    hectares: 17000,
    cabecas: 24000,
    perfil: "Semi-confinamento",
    ticket: 15,
    score: 77,
    status: "Em estruturação",
    contato: "Diretoria Comercial",
    observacao: "Boa escala e ótima narrativa para crédito privado.",
  },
  {
    nome: "Fazenda Ouro Branco",
    regiao: "Querência",
    latitude: -12.7,
    longitude: -52.1,
    hectares: 14000,
    cabecas: 20000,
    perfil: "ILP",
    ticket: 11,
    score: 79,
    status: "Mapeado",
    contato: "Controller",
    observacao: "Aderente para expansão de capacidade e performance.",
  },
  {
    nome: "Agro Norte Forte",
    regiao: "São Félix do Araguaia",
    latitude: -11.7,
    longitude: -50.6,
    hectares: 19000,
    cabecas: 28000,
    perfil: "Extensivo",
    ticket: 17,
    score: 82,
    status: "Em diligência",
    contato: "Sócio",
    observacao: "Operação de grande porte em polo pecuário consolidado.",
  },
  {
    nome: "Fazenda Horizonte",
    regiao: "Cáceres",
    latitude: -16.2,
    longitude: -57.5,
    hectares: 13000,
    cabecas: 17000,
    perfil: "Extensivo",
    ticket: 9,
    score: 68,
    status: "Mapeado",
    contato: "Administrador",
    observacao: "Janela clara para eficiência operacional e lotação.",
  },
];

const offsets = [
  { lat: 0, lng: 0 },
  { lat: 0.12, lng: 0.16 },
  { lat: -0.08, lng: 0.11 },
];

const leads: Lead[] = baseLeads.flatMap((lead, i) =>
  offsets.map((offset, j) => ({
    ...lead,
    id: i * 3 + j + 1,
    nome: `${lead.nome} ${j + 1}`,
    latitude: Number((lead.latitude + offset.lat).toFixed(4)),
    longitude: Number((lead.longitude + offset.lng).toFixed(4)),
    hectares: lead.hectares + j * 900,
    cabecas: lead.cabecas + j * 1500,
    ticket: lead.ticket + j * 1.5,
    score: Math.min(96, lead.score + j * 3),
    status:
      j === 2 && lead.status === "Mapeado" ? "Em estruturação" : lead.status,
  }))
);

function getPerfilColor(perfil: string) {
  if (perfil === "Extensivo") return "#ef4444";
  if (perfil === "ILP") return "#facc15";
  if (perfil === "Semi-confinamento") return "#38bdf8";
  return "#22c55e";
}

function getStatusStyle(status: string): React.CSSProperties {
  if (status === "Mapeado") {
    return {
      background: "rgba(100,116,139,.18)",
      color: "#e2e8f0",
      border: "1px solid rgba(148,163,184,.25)",
    };
  }
  if (status === "Em estruturação") {
    return {
      background: "rgba(245,158,11,.14)",
      color: "#fde68a",
      border: "1px solid rgba(245,158,11,.28)",
    };
  }
  if (status === "Em diligência") {
    return {
      background: "rgba(34,197,94,.14)",
      color: "#bbf7d0",
      border: "1px solid rgba(34,197,94,.28)",
    };
  }
  return {
    background: "rgba(16,185,129,.16)",
    color: "#d1fae5",
    border: "1px solid rgba(16,185,129,.35)",
  };
}

function formatMilhoes(value: number) {
  return `R$ ${value.toFixed(1).replace(".", ",")}M`;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR");
}

function cardStyle(extra: React.CSSProperties = {}): React.CSSProperties {
  return {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 28,
    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 60px rgba(0,0,0,.30)",
    ...extra,
  };
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: 18,
        borderRadius: 22,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          fontSize: 11,
          letterSpacing: 2.2,
          textTransform: "uppercase",
          color: "#94a3b8",
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 700, color: "white" }}>
        {value}
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState<Lead>(leads[0]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("Todas");
  const [perfil, setPerfil] = useState("Todos");
  const [ticketMin, setTicketMin] = useState(5);

  const regions = ["Todas", ...Array.from(new Set(leads.map((l) => l.regiao)))];
  const perfis = ["Todos", ...Array.from(new Set(leads.map((l) => l.perfil)))];

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText = search.toLowerCase();
      const okSearch =
        lead.nome.toLowerCase().includes(searchText) ||
        lead.regiao.toLowerCase().includes(searchText);
      const okRegion = region === "Todas" || lead.regiao === region;
      const okPerfil = perfil === "Todos" || lead.perfil === perfil;
      const okTicket = lead.ticket >= ticketMin;
      return okSearch && okRegion && okPerfil && okTicket;
    });
  }, [search, region, perfil, ticketMin]);

  const totalTicket = filteredLeads.reduce((sum, l) => sum + l.ticket, 0);
  const avgScore = filteredLeads.length
    ? Math.round(
        filteredLeads.reduce((sum, l) => sum + l.score, 0) /
          filteredLeads.length
      )
    : 0;
  const totalCabecas = filteredLeads.reduce((sum, l) => sum + l.cabecas, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right, rgba(34,197,94,.18), transparent 18%), radial-gradient(circle at bottom left, rgba(56,189,248,.12), transparent 22%), #06080b",
        color: "white",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1600, margin: "0 auto" }}>
        <div style={cardStyle({ padding: 24, marginBottom: 20 })}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 20,
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 20,
                  background: "rgba(34,197,94,.14)",
                  border: "1px solid rgba(52,211,153,.25)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 26,
                }}
              >
                🌎
              </div>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: 4,
                    textTransform: "uppercase",
                    color: "#86efac",
                    marginBottom: 6,
                  }}
                >
                  AgroCapital BR
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.1 }}>
                  Originação e estruturação de capital para grandes pecuaristas
                </div>
                <div style={{ marginTop: 10, color: "#94a3b8", fontSize: 15 }}>
                  Mapeamento proprietário de operações pecuárias com capacidade
                  de captação estruturada entre R$5M e R$50M+
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: 999,
                  background: "rgba(34,197,94,.12)",
                  border: "1px solid rgba(52,211,153,.22)",
                  color: "#bbf7d0",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Acesso restrito • Base proprietária
              </div>
              <button
                style={{
                  border: 0,
                  borderRadius: 18,
                  padding: "12px 18px",
                  background: "linear-gradient(135deg, #22c55e, #86efac)",
                  color: "#03120a",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 10px 30px rgba(34,197,94,.28)",
                }}
              >
                Solicitar acesso à base
              </button>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <StatBox
            label="Leads filtrados"
            value={String(filteredLeads.length)}
          />
          <StatBox
            label="Capital mapeado disponível"
            value={formatMilhoes(totalTicket)}
          />
          <StatBox label="Score médio" value={`${avgScore}/100`} />
          <StatBox
            label="Rebanho agregado"
            value={formatNumber(totalCabecas)}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "340px minmax(0, 1fr)",
            gap: 20,
          }}
        >
          <div style={cardStyle({ padding: 22, alignSelf: "start" })}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 18 }}>
              Filtros estratégicos
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 8 }}>
                Buscar fazenda ou região
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex: Cáceres, Xingu, Vale Verde"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,.09)",
                  background: "rgba(0,0,0,.22)",
                  color: "white",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 8 }}>
                Região
              </div>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,.09)",
                  background: "rgba(0,0,0,.22)",
                  color: "white",
                  outline: "none",
                }}
              >
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ color: "#cbd5e1", fontSize: 14, marginBottom: 8 }}>
                Perfil produtivo
              </div>
              <select
                value={perfil}
                onChange={(e) => setPerfil(e.target.value)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,.09)",
                  background: "rgba(0,0,0,.22)",
                  color: "white",
                  outline: "none",
                }}
              >
                {perfis.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  fontSize: 14,
                  color: "#cbd5e1",
                }}
              >
                <span>Ticket mínimo</span>
                <span style={{ color: "#86efac", fontWeight: 600 }}>
                  {formatMilhoes(ticketMin)}
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={30}
                step={1}
                value={ticketMin}
                onChange={(e) => setTicketMin(Number(e.target.value))}
                style={{ width: "100%" }}
              />
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 22,
                background: "rgba(34,197,94,.10)",
                border: "1px solid rgba(34,197,94,.18)",
                color: "#dcfce7",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <div
                style={{ fontWeight: 700, marginBottom: 6, color: "#bbf7d0" }}
              >
                Leitura executiva
              </div>
              <div>
                Priorize Cáceres, São Félix do Araguaia e Querência para
                originação com narrativa forte de expansão, intensificação e
                capital estruturado.
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 20 }}>
            <div style={cardStyle({ overflow: "hidden" })}>
              <div style={{ height: 640 }}>
                <MapContainer
                  center={[-13, -55]}
                  zoom={6}
                  style={{
                    height: "100%",
                    width: "100%",
                    background: "#081018",
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors &copy; CARTO"
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                  {filteredLeads.map((lead) => (
                    <CircleMarker
                      key={lead.id}
                      center={[lead.latitude, lead.longitude]}
                      radius={10}
                      pathOptions={{
                        color: getPerfilColor(lead.perfil),
                        fillColor: getPerfilColor(lead.perfil),
                        fillOpacity: 0.86,
                        weight: selected.id === lead.id ? 4 : 2,
                      }}
                      eventHandlers={{ click: () => setSelected(lead) }}
                    >
                      <Popup>
                        <div
                          style={{
                            color: "#0f172a",
                            fontSize: 14,
                            lineHeight: 1.5,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{lead.nome}</div>
                          <div>{lead.regiao}</div>
                          <div>{formatNumber(lead.hectares)} ha</div>
                          <div>{formatNumber(lead.cabecas)} cabeças</div>
                          <div>{formatMilhoes(lead.ticket)}</div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  ))}
                </MapContainer>
              </div>
            </div>

            <div style={cardStyle({ padding: 24 })}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.15fr .85fr",
                  gap: 22,
                }}
              >
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        background: getPerfilColor(selected.perfil),
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          letterSpacing: 3,
                          textTransform: "uppercase",
                          color: "#94a3b8",
                          marginBottom: 4,
                        }}
                      >
                        Lead selecionado
                      </div>
                      <div style={{ fontSize: 30, fontWeight: 700 }}>
                        {selected.nome}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      flexWrap: "wrap",
                      marginBottom: 18,
                    }}
                  >
                    <span
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,.05)",
                        border: "1px solid rgba(255,255,255,.08)",
                        color: "#f8fafc",
                        fontSize: 14,
                      }}
                    >
                      {selected.regiao}
                    </span>
                    <span
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,.05)",
                        border: "1px solid rgba(255,255,255,.08)",
                        color: "#f8fafc",
                        fontSize: 14,
                      }}
                    >
                      {selected.perfil}
                    </span>
                    <span
                      style={{
                        padding: "8px 12px",
                        borderRadius: 999,
                        fontSize: 14,
                        ...getStatusStyle(selected.status),
                      }}
                    >
                      {selected.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0,1fr))",
                      gap: 12,
                    }}
                  >
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 20,
                        background: "rgba(0,0,0,.22)",
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: "#94a3b8",
                          marginBottom: 8,
                        }}
                      >
                        Hectares
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {formatNumber(selected.hectares)}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 20,
                        background: "rgba(0,0,0,.22)",
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: "#94a3b8",
                          marginBottom: 8,
                        }}
                      >
                        Cabeças
                      </div>
                      <div style={{ fontSize: 24, fontWeight: 700 }}>
                        {formatNumber(selected.cabecas)}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 20,
                        background: "rgba(0,0,0,.22)",
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: "#94a3b8",
                          marginBottom: 8,
                        }}
                      >
                        Ticket
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 700,
                          color: "#86efac",
                        }}
                      >
                        {formatMilhoes(selected.ticket)}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: 16,
                        borderRadius: 20,
                        background: "rgba(0,0,0,.22)",
                        border: "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          textTransform: "uppercase",
                          letterSpacing: 2,
                          color: "#94a3b8",
                          marginBottom: 8,
                        }}
                      >
                        Contato alvo
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>
                        {selected.contato}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 16,
                      padding: 18,
                      borderRadius: 22,
                      background: "rgba(0,0,0,.22)",
                      border: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: "#94a3b8",
                        marginBottom: 10,
                      }}
                    >
                      Tese executiva
                    </div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: 15,
                        lineHeight: 1.7,
                      }}
                    >
                      {selected.observacao}
                    </div>
                    <div
                      style={{ marginTop: 12, color: "#94a3b8", fontSize: 14 }}
                    >
                      Capacidade estimada de absorção:{" "}
                      {formatMilhoes(selected.ticket * 3)}
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 14 }}>
                  <div
                    style={{
                      padding: 20,
                      borderRadius: 24,
                      background: "rgba(34,197,94,.10)",
                      border: "1px solid rgba(34,197,94,.18)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: "#bbf7d0",
                        marginBottom: 10,
                      }}
                    >
                      Score de captação
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 8,
                        marginBottom: 14,
                      }}
                    >
                      <span
                        style={{ fontSize: 52, lineHeight: 1, fontWeight: 700 }}
                      >
                        {selected.score}
                      </span>
                      <span style={{ color: "#cbd5e1", paddingBottom: 6 }}>
                        /100
                      </span>
                    </div>
                    <div
                      style={{
                        height: 12,
                        borderRadius: 999,
                        background: "rgba(0,0,0,.28)",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${selected.score}%`,
                          height: "100%",
                          borderRadius: 999,
                          background:
                            "linear-gradient(90deg, #86efac, #bef264, #22c55e)",
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      padding: 20,
                      borderRadius: 24,
                      background: "rgba(0,0,0,.22)",
                      border: "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: 2,
                        color: "#94a3b8",
                        marginBottom: 10,
                      }}
                    >
                      Próximo movimento
                    </div>
                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: 15,
                        lineHeight: 1.8,
                      }}
                    >
                      <div>• Validar estrutura societária e decisor.</div>
                      <div>
                        • Enquadrar tese entre crédito, expansão ou
                        intensificação.
                      </div>
                      <div>
                        • Abrir reunião com narrativa de capital produtivo.
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      style={{
                        flex: 1,
                        border: 0,
                        borderRadius: 18,
                        padding: "14px 18px",
                        background: "linear-gradient(135deg, #22c55e, #86efac)",
                        color: "#03120a",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 10px 30px rgba(34,197,94,.24)",
                      }}
                    >
                      Registrar contato
                    </button>
                    <button
                      style={{
                        flex: 1,
                        borderRadius: 18,
                        padding: "14px 18px",
                        background: "transparent",
                        color: "white",
                        border: "1px solid rgba(255,255,255,.10)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Exportar lead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
