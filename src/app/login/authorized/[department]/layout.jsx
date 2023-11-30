import SidebarDepartment from '@/components/SidebarDepartment';

export default function RootLayout(prop) {
  return (
    <>
        <SidebarDepartment department={prop.params.department}/>
        {prop.children}
    </>
  );
}
