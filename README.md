# Flask_Blog + Mood Tarot App

## Mood Tarot (지금 내 기분이 어때?)

모바일 타로 기분 앱입니다.

### 실행 방법

```bash
# 1. 의존성 설치 (최초 1회)
npm run install:app

# 2. 개발 서버 실행
npm run dev
```

브라우저에서 표시되는 주소(예: `http://localhost:5173`)로 접속하세요.

> `tarot-mood-app` 폴더 안에서 직접 실행하려면:
> ```bash
> cd tarot-mood-app
> npm install
> npm run dev
> ```

### 문제 해결

| 증상 | 해결 |
|------|------|
| `package.json` 없음 오류 | 저장소 **루트**에서 `npm run install:app` 후 `npm run dev` |
| `vite: command not found` | `npm run install:app` 으로 의존성 재설치 |
| 페이지가 안 열림 | 터미널에 표시된 Network 주소 사용 (예: `http://0.0.0.0:5173`) |

---

## Flask Blog (기존)

1. Download
2. Open terminal (Directory: `flask_blog`)
3. `export FLASK_APP=flaskr` / `export FLASK_ENV=development` / `flask run`
4. login: ID: `min` / PW: `0724`

![1](https://user-images.githubusercontent.com/43161094/55701446-1b906280-5a0e-11e9-917a-350897e0978c.jpg)
![2](https://user-images.githubusercontent.com/43161094/55701449-1cc18f80-5a0e-11e9-8818-e5e0dff2cb06.jpg)
