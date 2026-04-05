import { createLogger } from './utils/logger.js';
import { PacketEmitter } from './emitter/packetEmitter.js';
import { UDPSocket } from './socket/udpSocket.js';
import { SocketBroadcaster } from './broadcaster/socketBroadcaster.js';

const logger = createLogger('listener');

/**
 * Main entry point for the F1 Telemetry listener
 * Combines UDP socket, packet parsing, and Socket.io broadcasting
 */
async function main() {
  logger.info('Starting F1 Telemetry listener...');

  // Create the packet emitter
  const emitter = new PacketEmitter(logger);

  // Create UDP socket
  const udpSocket = new UDPSocket(emitter, logger);

  // Create Socket.io broadcaster
  const broadcaster = new SocketBroadcaster(emitter, logger);

  // Handle shutdown gracefully
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Shutting down...');
    await broadcaster.stop();
    await udpSocket.stop();
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  // Log packet statistics
  emitter.on('carTelemetry', () => {
    // Car telemetry received - will be forwarded by broadcaster
  });

  // Start services
  try {
    await broadcaster.start();
    await udpSocket.start();
    logger.info('F1 Telemetry listener started successfully');
  } catch (error) {
    logger.error({ error }, 'Failed to start listener');
    process.exit(1);
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { createLogger, PacketEmitter, UDPSocket, SocketBroadcaster };
export * from './parser/index.js';
export type { PacketEvents } from './emitter/packetEmitter.js';
export type { UDPSocketOptions } from './socket/udpSocket.js';
export type { SocketBroadcasterOptions } from './broadcaster/socketBroadcaster.js';
