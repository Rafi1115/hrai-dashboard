import StatCard from "@/components/MetricCard";
import RegistrationTable from "@/components/RegistrationTable";
import ChartCard from "@/components/EarningSummaryChart";
import { Area, ResponsiveContainer } from "recharts";
import AlcoholConsumptionTrendChart from "@/components/AlcoholConsumptionTrendChart";
import EarningSummaryChart from "@/components/EarningSummaryChart";
import MetricCard from "@/components/MetricCard";
import RecentSubscriber from "@/components/RecentSubscriber";

const Admin = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <div className="bg-white text-black w-full ">
        <div className="">
          {/* Total User Card */}
          <MetricCard
           
          />

          {/* Total Service Provider Card */}
          {/* <MetricCard
            title="Total Rider"
            value={200}
            percentageChange={4}
            percentageDirection="up" 
            timePeriodData={months}
          />
          <MetricCard
            title="Total Restaurant"
            value={200}
            percentageChange={4}
            percentageDirection="up" 
            timePeriodData={months}
          /> */}
        </div>

        <div className=" p-4">
          {/* Earning Summary Chart */}
          <div className=" w-full flex flex-col md:flex-row gap-4">
            {/* Ensure minimum height for chart visibility */}
            <EarningSummaryChart  />
            <AlcoholConsumptionTrendChart />
          </div>

          {/* Alcohol Consumption Trend Line Chart */}
          {/* <div className="min-h-[340px]"> */}

          {/* Ensure minimum height for chart visibility */}
          
          {/* </div> */}
        </div>

        <div className="p-4">
         <RecentSubscriber />
        </div>
      </div>
    </>
  );
};
export default Admin;
