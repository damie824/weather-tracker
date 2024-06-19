import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Globe from "@/components/ui/globe";

export default function MainPage() {
  //   const kma = new KmaClient(import.meta.env.VITE_KMA_API_KEY || "");

  return (
    <main className="h-[100vh] overflow-hidden">
      <div className="flex flex-col justify-center items-center mt-[15vh] mb-5">
        <Badge className="mb-3">다미네 연구소</Badge>
        <h1 className="text-5xl font-bold text-center">
          실시간 전국 날씨 트래커
        </h1>
        <div className="mt-7 flex gap-2">
          <a href="https://damie.works/profile" className={buttonVariants()}>
            개발자 정보
          </a>
          <a
            href="https://github.com/damie824"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <div className="mr-2 flex items-center">
              <svg
                viewBox="0 0 16 16"
                fill="currentColor"
                height="1em"
                width="1em"
              >
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
            </div>
            소스코드
          </a>
        </div>
      </div>
      <div className="relative left-[-15vw] z-0">
        <Globe className="w-[130vw] h-[auto]" />
      </div>
    </main>
  );
}
