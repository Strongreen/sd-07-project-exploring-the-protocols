const net = require('net');
const os = require('os');

const { getLocationInfos } = require('./location');

const getHeaderValue = (data, header) => {
  const headerData = data
    .split('\r\n')
    .find((chunk) => chunk.startsWith(header));

  return headerData.split(': ').pop();
};

const startOfResponse = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=UTF-8\r\n\r\n';

const endOfResponse = '\\r\\n\\r\\n';

// Informações do cliente
const plataform = os.platform();
const arch = os.arch();
const release = os.release();
const cpu = os.cpus();
const mem = os.totalmem();
const memRAM = (Math.round(mem / 1e+9) * 100) / 100;

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const clientIP = getHeaderValue(data.toString(), 'X-Forwarded-For');
    const device = getHeaderValue(data.toString(), 'User-Agent');

    getLocationInfos(clientIP, (locationData) => {
      console.log(locationData);
      socket.write(startOfResponse);
      socket.write('<html><head><meta http-equiv="content-type" content="text/html;charset=utf-8">');
      socket.write('<title>Trybe 🚀</title></head><body>');
      socket.write('<H1>Explorando os Protocolos 🧐🔎</H1>');
      socket.write(`<p data-testid="ip">${clientIP}</p>`);
      socket.write(`<p data-testid="city">${locationData.city}</p>`);
      socket.write(`<p data-testid="postal_code">${locationData.postal_code}</p>`);
      socket.write(`<p data-testid="region">${locationData.region}</p>`);
      socket.write(`<p data-testid="country">${locationData.country_name}</p>`);
      socket.write(`<p data-testid="company">${locationData.company}</p>`);
      socket.write(`<p data-testid="device">${device}</p>`);
      socket.write(`<p data-testid="arch">Sistema Operacional: ${plataform}. Versão: ${release} Arquitetura: ${arch}.</p>`);
      socket.write(`<p data-testid="cpu">O cliente possui uma CPU com ${cpu.length} cores, do modelo ${cpu[0].model} com a capacidade de ${cpu[0].speed / 1000} GHz.</p>`);
      socket.write(`<p data-testid="memory">Memória RAM: ${memRAM} GB.</p>`);

      socket.write('<iframe src="https://giphy.com/embed/l3q2zVr6cu95nF6O4" width="480" height="236" frameBorder="0" class="giphy-embed" allowFullScreen></iframe>');
      socket.write('</body></html>');
      socket.write(endOfResponse);
    });
  });
});

server.listen(8080);
