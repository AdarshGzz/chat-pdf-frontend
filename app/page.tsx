import Chat from "@/components/Chat";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
   <main className="h-screen w-screen">
    <div className=" ">
        <Navbar/>
    </div>
    <Chat/>
   </main>
  );
}
