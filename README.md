# LetsJandi

1일 1커밋 인증 디스코드 봇

## Commands

- `/인증`: 오늘 잔디를 인증합니다.
- `/등록 <github-id>`: 자신의 계정을 등록합니다.

## Prerequisites

- Node.js v20.15.0

> Node v20의 기능을 사용하는 것은 아닙니다. 위 버전은 개발이 진행되었던 버전입니다.

## Installation

```shell
git clone https://github.com/SUSC-KR/LetsJandi.git
cd LetsJandi
npm install
```

## Init for discord

```shell
npm run init
```

디스코드의 봇에 명령어 정보를 등록해야 디스코드에서 정상적으로 명령어 사용이 가능합니다.

## Run in development

```shell
npm run start
```

## Run in production

```shell
npm run build
npm run start:prod
```
