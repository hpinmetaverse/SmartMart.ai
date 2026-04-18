import { redirect } from "next/navigation";

async function AdminDashboard() {
  redirect("/seller/dashboard");
}

export default AdminDashboard;
