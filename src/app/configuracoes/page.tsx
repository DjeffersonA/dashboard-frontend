import { ModeToggle } from "@/components/modetoggle";
import AppContext from "@/context/app.context";

export default function Configuracoes() {
  return (
    <>
      <AppContext><ModeToggle/></AppContext>
    </>
  );
}
