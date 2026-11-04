import { APP_NAME, APP_TAGLINE, SEAT_STATUS_LABELS } from "@firstrow/shared";
import type { SeatStatus } from "@firstrow/shared";

const status: SeatStatus = "held";

console.log(`${APP_NAME} - ${APP_TAGLINE}`);
console.log(`A seat can be: ${Object.keys(SEAT_STATUS_LABELS).join(", ")}`);
console.log(`This one is: ${SEAT_STATUS_LABELS[status]}`);
