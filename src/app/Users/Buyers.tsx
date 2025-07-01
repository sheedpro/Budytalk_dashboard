import { useEffect } from "react";
import ChartCard from "@/components/DashBoard/ChartCard";
import BuyersTable from "@/components/Users/BuyersTable";
import { useUsers } from "@/hooks/useUsers";
import { useDispatch } from "react-redux";
export default function Buyers() {
  const dispatch = useDispatch();
  const { makeUserCalls, Buyers } = useUsers();
  const ChatData = [
    {
      _id: 1,
      _title: "Total Buyers",
      total: 0,
      trend: 0,
    },
  ];
  useEffect(() => {
    const fetchBuyersData = async () => {
      try {
        await makeUserCalls.fetchBuyers(dispatch);
      } catch (err) {
        console.error("Error fetching buyers:", err);
      }
    };
    fetchBuyersData();
  }, [dispatch]);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ChatData.map((data) => (
          <ChartCard
            key={data._id}
            _title={data._title}
            total={data.total}
            trend={data.trend}
          />
        ))}
      </div>
      <div>
        <BuyersTable buyers={Buyers} />
      </div>
    </div>
  );
}
