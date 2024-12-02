/// <reference types="node" />
import fs from "fs";
import path from "path";

const ENV_LOCAL_PATH = path.join(__dirname, "..", ".env.local");
const ENV_PATH = path.join(__dirname, "..", ".env");
const OUTPUT_FILE_PATH = path.join(__dirname, "../src/types", "env.d.ts");

function readEnvFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function generateEnvTypes() {
  try {
    // .env.local 또는 .env 파일 읽기
    let envContent: string;
    try {
      envContent = readEnvFile(ENV_LOCAL_PATH);
      console.log("✅ .env.local 파일을 읽었습니다.");
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        try {
          envContent = readEnvFile(ENV_PATH);
          console.log("✅ .env 파일을 읽었습니다.");
        } catch (envError) {
          throw new Error("❌ .env.local 또는 .env 파일이 없습니다.");
        }
      } else {
        throw error;
      }
    }

    // 환경 변수 키 추출
    const envKeys = envContent
      .split("\n")
      .filter(
        (line) =>
          line.trim() !== "" && !line.startsWith("#") && line.includes("=")
      )
      .map((line) => line.split("=")[0].trim());

    // env.d.ts 파일 내용 생성
    const typeDefinition = `declare namespace NodeJS {
  interface ProcessEnv {
${envKeys.map((key) => `    ${key}: string;`).join("\n")}
  }
}
`;

    // env.d.ts 파일 작성
    fs.writeFileSync(OUTPUT_FILE_PATH, typeDefinition);
    console.log("✅ env.d.ts 파일이 성공적으로 생성되었습니다.");
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("❌ 알 수 없는 에러가 발생했습니다.");
    }
    process.exit(1);
  }
}

generateEnvTypes();
