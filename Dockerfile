FROM public.ecr.aws/lambda/nodejs:20


ARG PRODUCTION=true

COPY index.js ${LAMBDA_TASK_ROOT}
COPY package.json ${LAMBDA_TASK_ROOT}
COPY package-lock.json ${LAMBDA_TASK_ROOT}

RUN npm install --production=$PRODUCTION

CMD [ "index.handler" ]  
