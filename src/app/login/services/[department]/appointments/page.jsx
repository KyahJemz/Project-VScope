import SetAppointment from "@/components/Layouts/SetAppointment/SetAppointment"
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const Appointments = async ({ params }) => {
  if (params.department === 'Dental' || params.department === 'Medical' || params.department === 'SDPC') {

  } else {
    redirect('/login/services');
  }

  const session = await getServerSession(authOptions);
  if (session === null) {
      redirect('/login');
  } else {
      const data = {session: session.user, department: params.department }
      return (<SetAppointment req={data} />);
  }
}
export default Appointments;