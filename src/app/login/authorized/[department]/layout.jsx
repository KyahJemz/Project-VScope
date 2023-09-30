
import Sidebar from "@/components/sidebar/Sidebar";


export default function RootLayout(prop) {
  console.log(prop);
  return (
    <div className="authorized">
        <Sidebar department={prop.params.department}/>
        {prop.children}
    </div>
  );
}
