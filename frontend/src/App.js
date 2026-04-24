import SpeciWiseApp from "./SpeciWiseApp";
import SplashCursor from "./components/SplashCursor"; // adjust path if needed

function App() {
  return (
    <>
      <SplashCursor
        DENSITY_DISSIPATION={3.5}
        VELOCITY_DISSIPATION={2}
        PRESSURE={0.1}
        CURL={3}
        SPLAT_RADIUS={0.2}
        SPLAT_FORCE={6000}
        COLOR_UPDATE_SPEED={10}
        SHADING
        RAINBOW_MODE={false}
        COLOR="#03045e"
      />
      
      <SpeciWiseApp />
    </>
  );
}

export default App;