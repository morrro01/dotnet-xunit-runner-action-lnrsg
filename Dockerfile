FROM mcr.microsoft.com/dotnet/sdk:6.0
LABEL repository="https://github.com/morrro01/dotnet-xunit-runner-action-lnrsg" \
    homepage="https://github.com/morrro01/dotnet-xunit-runner-action-lnrsg" \
    maintainer="morrro01" \
    com.github.actions.name=".NET XUnit Runner Action" \
    com.github.actions.description="GitHub action that runs XUnit against a .NET project, and reports the results." \
    com.github.actions.icon="heart" \
    com.github.actions.color="red"
USER root
RUN apk add --update nodejs
COPY ./action/ /action/
ENTRYPOINT [ "node", "/action/index.js" ]