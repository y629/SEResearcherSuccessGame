# Node 20 は Next 13/14/15 で相性良し
FROM node:20-bookworm

ENV LANG=C.UTF-8
ENV TZ=Asia/Tokyo

RUN apt-get update && apt-get install -y \
    git bash ca-certificates openssl curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# pnpm を有効化（必要ならバージョン上げてもOK）
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

EXPOSE 3000

# エントリポイントをコピー（※別ファイルにする）
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

CMD ["/usr/local/bin/docker-entrypoint.sh"]
