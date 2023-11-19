
import Sidebar from "@/components/sidebar/Sidebar";


export default function RootLayout(prop) {
  return (
    <>
        <Sidebar department={prop.params.department}/>
        {prop.children}
    </>
  );
}
