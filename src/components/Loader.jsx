export default function Loader() {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative w-12 h-12">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: "#723248",
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 45}deg) translate(20px)`,
                animation: "dot-spin 1s linear infinite",
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
  
        <style>
          {`
            @keyframes dot-spin {
              0% { opacity: 1; }
              100% { opacity: 0.2; }
            }
          `}
        </style>
      </div>
    );
  }
  