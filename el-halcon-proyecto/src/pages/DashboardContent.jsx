import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  UsersIcon,
  NewspaperIcon,
  ClipboardDocumentIcon,
  UserCircleIcon,
  Squares2X2Icon,
  PlusIcon,
  Cog6ToothIcon,
  ChevronUpIcon,
  DocumentDuplicateIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/outline"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Registrar los componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler)

function DashboardContent() {
  const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api"

  // state for counts
  const [counts, setCounts] = useState({
    customers: 0,
    orders: 0,
    products: 0,
    providers: 0,
  })

  // State para el tipo de gráfico
  const [chartType, setChartType] = useState("line") // 'line' o 'bar'
  const [timeRange, setTimeRange] = useState("month") // 'week', 'month', 'year'

  useEffect(() => {
    async function loadCounts() {
      try {
        const [custRes, prodRes, provRes] = await Promise.all([
          fetch(`${API}/customers`),
          fetch(`${API}/products`),
          fetch(`${API}/providers`),
        ])
        const [custs, prods, provs] = await Promise.all([custRes.json(), prodRes.json(), provRes.json()])
        setCounts({
          customers: Array.isArray(custs) ? custs.length : 0,
          products: Array.isArray(prods) ? prods.length : 0,
          providers: Array.isArray(provs) ? provs.length : 0,
          orders: Math.floor(Math.random() * 100) + 50, // Datos aleatorios para órdenes
        })
      } catch (err) {
        console.error("Error loading counts", err)
      }
    }
    loadCounts()
  }, [])

  // DATOS STATS PARA MAP
  const stats = [
    { label: "New Customers", value: counts.customers, icon: UsersIcon, percentage: 8 },
    { label: "New Orders", value: counts.orders, icon: NewspaperIcon, percentage: 27 },
    { label: "New Products", value: counts.products, icon: ClipboardDocumentIcon, percentage: 8 },
    { label: "Providers Registered", value: counts.providers, icon: UserCircleIcon, percentage: 5 },
  ]

  const additionalStats = [
    { label: "Providers Registered", value: counts.providers, icon: UserCircleIcon },
    { label: "Pawns Registered", value: 25, icon: ClipboardDocumentIcon },
    { label: "Sales Registered", value: counts.orders, icon: NewspaperIcon },
    { label: "Documents", value: 34, icon: DocumentDuplicateIcon },
  ]

  // Generar datos aleatorios para el gráfico
  const generateChartData = () => {
    let labels = []
    let salesData = []
    let profitData = []

    if (timeRange === "week") {
      labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
      salesData = Array.from({ length: 7 }, () => Math.floor(Math.random() * 5000) + 1000)
      profitData = salesData.map((sale) => sale * (Math.random() * 0.3 + 0.1)) // 10-40% de ganancia
    } else if (timeRange === "month") {
      labels = Array.from({ length: 30 }, (_, i) => i + 1)
      salesData = Array.from({ length: 30 }, () => Math.floor(Math.random() * 8000) + 2000)
      profitData = salesData.map((sale) => sale * (Math.random() * 0.3 + 0.1))
    } else if (timeRange === "year") {
      labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      salesData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 100000) + 20000)
      profitData = salesData.map((sale) => sale * (Math.random() * 0.3 + 0.1))
    }

    return {
      labels,
      datasets: [
        {
          label: "Ventas",
          data: salesData,
          borderColor: "#FF5E0A",
          backgroundColor: "rgba(255, 94, 10, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#FF5E0A",
          pointRadius: chartType === "line" ? 3 : 0,
        },
        {
          label: "Ganancias",
          data: profitData,
          borderColor: "#8a8aef",
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "#8a8aef",
          pointRadius: chartType === "line" ? 3 : 0,
        },
      ],
    }
  }

  const chartData = generateChartData()

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 13,
        },
        bodyFont: {
          size: 12,
        },
        padding: 10,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(context.parsed.y)
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 10,
          },
          callback: (value) => {
            if (value >= 1000) {
              return "$" + value / 1000 + "k"
            }
            return "$" + value
          },
        },
      },
    },
  }

  // Calcular tendencia de ventas (datos aleatorios)
  const salesTrend =
    Math.random() > 0.5
      ? {
          percentage: (Math.random() * 15 + 5).toFixed(1),
          isUp: true,
        }
      : {
          percentage: (Math.random() * 10 + 1).toFixed(1),
          isUp: false,
        }

  return (
    <div className="flex flex-col space-y-6 p-4 md:p-6">
      {/* OVERVIEW Y ICONO */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-[#Fff] bg-[#FF5E0A] p-2 rounded">
            <Squares2X2Icon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-medium text-gray-700">Overview</h2>
        </div>

        <Link
          to="/dashboard/add"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          Create New
          <span className="bg-white/20 rounded p-0.5">
            <PlusIcon className="w-4 h-4" />
          </span>
        </Link>
      </div>

      {/* TARJETAS DE ESTADISTICAS USANDO STATS CON MAP */}
      <div className="flex flex-wrap gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow-sm p-6 relative flex-1 min-w-[250px] sm:min-w-[200px]">
            <div className="flex justify-between items-start mb-4">
              <div className="text-[#F24822]">
                <stat.icon className="w-6 h-6" />
              </div>
              <button className="text-[#F24822] ">
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-5xl font-bold mb-2">{stat.value}</h3>
            <p className="text-gray-500">{stat.label}</p>

            <div className="absolute bottom-6 right-6 bg-[#F24822] text-white text-xs px-2 py-1 rounded flex items-center">
              {stat.percentage}% <ChevronUpIcon className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {/* SECCIÓN DE LA GRÁFICA */}
      <div className="flex flex-col lg:flex-row gap-6 mt-12">
        <div className="bg-white rounded-lg shadow-sm p-6 flex-1 lg:w-3/4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-medium text-gray-700">Sale Orders</h3>
              <div className="flex items-center mt-1">
                <span
                  className={`text-sm font-medium flex items-center ${salesTrend.isUp ? "text-[#8a8aef]" : "text-red-500"}`}
                >
                  {salesTrend.isUp ? (
                    <ArrowUpIcon className="w-3 h-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-3 h-3 mr-1" />
                  )}
                  {salesTrend.percentage}%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Selector de rango de tiempo */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setTimeRange("week")}
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === "week" ? "bg-white shadow-sm" : "text-gray-500"}`}
                >
                  Semana
                </button>
                <button
                  onClick={() => setTimeRange("month")}
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === "month" ? "bg-white shadow-sm" : "text-gray-500"}`}
                >
                  Mes
                </button>
                <button
                  onClick={() => setTimeRange("year")}
                  className={`px-3 py-1 text-xs rounded-md ${timeRange === "year" ? "bg-white shadow-sm" : "text-gray-500"}`}
                >
                  Año
                </button>
              </div>

              {/* Selector de tipo de gráfico */}
              <div className="flex bg-gray-100 rounded-md p-1">
                <button
                  onClick={() => setChartType("line")}
                  className={`px-3 py-1 text-xs rounded-md ${chartType === "line" ? "bg-white shadow-sm" : "text-gray-500"}`}
                >
                  Línea
                </button>
                <button
                  onClick={() => setChartType("bar")}
                  className={`px-3 py-1 text-xs rounded-md ${chartType === "bar" ? "bg-white shadow-sm" : "text-gray-500"}`}
                >
                  Barra
                </button>
              </div>
            </div>
          </div>

          <div className="h-64">
            {chartType === "line" ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Bar data={chartData} options={chartOptions} />
            )}
          </div>
        </div>

        {/* Otras estadísticas */}
        <div className="flex flex-col space-y-6 lg:w-1/4">
          {additionalStats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-[#F24822] p-2 rounded">
                  <stat.icon className="w-5 h-5 text-[#Fff]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              </div>
              <div className="bg-[#F24822] text-white text-xs px-2 py-1 rounded flex items-center">
                Edit <ChevronUpIcon className="w-3 h-3 ml-1 rotate-90" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardContent

  