import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl, currency } from '../App'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { toast } from 'react-toastify'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const Dashboard = ({ token }) => {

  const [orders, setOrders] = useState([])
  const [totalSales, setTotalSales] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  })

  const fetchDashboardData = async () => {
    try {
      const response = await axios.post(backendUrl + '/api/order/list', {}, { headers: { token } })
      if (response.data.success) {
        const fetchedOrders = response.data.orders;
        setOrders(fetchedOrders);
        setTotalOrders(fetchedOrders.length);
        
        // Calculate Total Sales
        const sales = fetchedOrders.reduce((acc, order) => acc + order.amount, 0);
        setTotalSales(sales);

        // Process Data for Chart (Daily Sales for last 7 days)
        processChartData(fetchedOrders);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const processChartData = (allOrders) => {
    const days = 7;
    const labels = [];
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(now.getDate() - i);
      const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      labels.push(dateString);

      // Sum orders for this specific date
      const dailyTotal = allOrders.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate.toLocaleDateString() === date.toLocaleDateString();
      }).reduce((acc, curr) => acc + curr.amount, 0);

      data.push(dailyTotal);
    }

    setChartData({
      labels,
      datasets: [
        {
          fill: true,
          label: 'Daily Sales',
          data: data,
          borderColor: 'rgb(139, 92, 246)',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: 'rgb(139, 92, 246)',
        }
      ]
    });
  }

  useEffect(() => {
    fetchDashboardData()
  }, [token])

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className='max-w-7xl'>
        <div className='mb-10'>
            <h3 className='text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase'>Dashboard</h3>
            <p className='text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-1.5'>Sales Overview & Analytics</p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
            <div className='admin-card p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none'>
                <div className='w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-6'>
                    <svg className='w-6 h-6 text-violet-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                </div>
                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2'>Gross Revenue</p>
                <h4 className='text-3xl font-black text-gray-900 dark:text-white'>{currency}{totalSales.toLocaleString()}</h4>
                <div className='mt-6 flex items-center gap-2'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                    <p className='text-[10px] text-gray-400 font-bold uppercase tracking-widest'>Live & Updating</p>
                </div>
            </div>

            <div className='admin-card p-6 border-none shadow-xl shadow-gray-200/50 dark:shadow-none'>
                <div className='w-12 h-12 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-900/20 flex items-center justify-center mb-6'>
                    <svg className='w-6 h-6 text-fuchsia-500' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                        <path strokeLinecap='round' strokeLinejoin='round' d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' />
                    </svg>
                </div>
                <p className='text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2'>Total Deliveries</p>
                <h4 className='text-3xl font-black text-gray-900 dark:text-white'>{totalOrders}</h4>
                <div className='mt-6 h-1.5 w-full bg-gray-50 dark:bg-gray-800 rounded-full overflow-hidden'>
                    <div className='h-full bg-fuchsia-500 w-3/4 rounded-full'></div>
                </div>
            </div>

            <div className='bg-violet-600 p-6 rounded-[2.5rem] shadow-2xl shadow-violet-500/30 text-white flex flex-col justify-between relative overflow-hidden group'>
                <div className='absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150'></div>
                <div className='relative z-10'>
                    <div className='w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6'>
                        <svg className='w-6 h-6 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={2.5}>
                            <path strokeLinecap='round' strokeLinejoin='round' d='M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' />
                        </svg>
                    </div>
                    <p className='text-[10px] font-black uppercase tracking-[0.25em] opacity-70 mb-2'>System Status</p>
                    <h4 className='text-xl font-bold tracking-tight'>All Systems Active</h4>
                </div>
                <button 
                  onClick={() => toast.info("Advanced analytics coming in the next release.")}
                  className='relative z-10 bg-white/20 hover:bg-white text-white hover:text-violet-600 transition-all duration-300 py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mt-8 self-start active:scale-[0.98]'
                >
                  Deep Analytics
                </button>
            </div>
        </div>

        {/* Graph Section */}
        <div className='admin-card p-8 border-none shadow-2xl shadow-gray-200/40 dark:shadow-none'>
            <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-12 gap-4'>
                <div>
                   <h4 className='text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight'>Sales Chart</h4>
                   <p className='text-[10px] text-gray-400 font-bold uppercase tracking-[0.25em] mt-1.5'>Last 7 Days Revenue</p>
                </div>
                <div className='flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 px-4 py-2 rounded-2xl border border-gray-100 dark:border-gray-800'>
                    <div className='w-2.5 h-2.5 rounded-full bg-violet-500'></div>
                    <span className='text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400'>Revenue Trend</span>
                </div>
            </div>
            
            <div className='h-[250px] sm:h-[350px] md:h-[400px] w-full'>
                <Line options={chartOptions} data={chartData} />
            </div>
        </div>
    </div>
  )
}

export default Dashboard
