import sharp from 'sharp';
import 'promise.withresolvers/auto';

const keypress = async () => {
    const { resolve, _reject, promise } = Promise.withResolvers();

    process.stdin.setRawMode(true);
    process.stdin.once('data', () => {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve();
    });

    return promise;
};

const saveCursor = () => process.stdout.write('\x1b7');
const restoreCursor = () => process.stdout.write('\x1b8');
const setCursor = (row, col) => process.stdout.write(`\x1b[${row};${col}H`);
const clearDisplay = () => process.stdout.write('\x1b[2J');

const alternateBuffer = () => process.stdout.write('\x1b[?47h');
const normalBuffer = () => process.stdout.write('\x1b[?47l');

const hideCursor = () => process.stdout.write('\x1b[?25l');
const showCursor = () => process.stdout.write('\x1b[?25h');

const setForeground = (r, g, b) => process.stdout.write(`\x1b[38;2;${r};${g};${b}m`);
const setBackground = (r, g, b) => process.stdout.write(`\x1b[48;2;${r};${g};${b}m`);
const resetColor = () => process.stdout.write('\x1b[0m');

// const palette0 = [
//     { r:   0, g:   0, b:   0 },         // black
//     { r: 170, g:   0, b:   0 },         // red
//     { r:   0, g: 170, b:   0 },         // green
//     { r: 255, g: 255, b:  85 }          // yellow
// ];

const palette1 = [
    { r:   0, g:   0, b:   0 },         // black
    { r: 170, g:   0, b: 170 },         // magenta
    { r:   0, g: 170, b: 170 },         // cyan
    { r: 255, g: 255, b: 255 }          // white
];

const BLOCKS_4x2 = [
    ' ', '𜺨', '𜺫', '🮂', '𜴀', '▘', '𜴁', '𜴂', '𜴃', '𜴄', '▝', '𜴅', '𜴆', '𜴇', '𜴈', '▀',
    '𜴉', '𜴊', '𜴋', '𜴌', '🯦', '𜴍', '𜴎', '𜴏', '𜴐', '𜴑', '𜴒', '𜴓', '𜴔', '𜴕', '𜴖', '𜴗',
    '𜴘', '𜴙', '𜴚', '𜴛', '𜴜', '𜴝', '𜴞', '𜴟', '🯧', '𜴠', '𜴡', '𜴢', '𜴣', '𜴤', '𜴥', '𜴦',
    '𜴧', '𜴨', '𜴩', '𜴪', '𜴫', '𜴬', '𜴭', '𜴮', '𜴯', '𜴰', '𜴱', '𜴲', '𜴳', '𜴴', '𜴵', '🮅',
    '𜺣', '𜴶', '𜴷', '𜴸', '𜴹', '𜴺', '𜴻', '𜴼', '𜴽', '𜴾', '𜴿', '𜵀', '𜵁', '𜵂', '𜵃', '𜵄',
    '▖', '𜵅', '𜵆', '𜵇', '𜵈', '▌', '𜵉', '𜵊', '𜵋', '𜵌', '▞', '𜵍', '𜵎', '𜵏', '𜵐', '▛',
    '𜵑', '𜵒', '𜵓', '𜵔', '𜵕', '𜵖', '𜵗', '𜵘', '𜵙', '𜵚', '𜵛', '𜵜', '𜵝', '𜵞', '𜵟', '𜵠',
    '𜵡', '𜵢', '𜵣', '𜵤', '𜵥', '𜵦', '𜵧', '𜵨', '𜵩', '𜵪', '𜵫', '𜵬', '𜵭', '𜵮', '𜵯', '𜵰',
    '𜺠', '𜵱', '𜵲', '𜵳', '𜵴', '𜵵', '𜵶', '𜵷', '𜵸', '𜵹', '𜵺', '𜵻', '𜵼', '𜵽', '𜵾', '𜵿',
    '𜶀', '𜶁', '𜶂', '𜶃', '𜶄', '𜶅', '𜶆', '𜶇', '𜶈', '𜶉', '𜶊', '𜶋', '𜶌', '𜶍', '𜶎', '𜶏',
    '▗', '𜶐', '𜶑', '𜶒', '𜶓', '▚', '𜶔', '𜶕', '𜶖', '𜶗', '▐', '𜶘', '𜶙', '𜶚', '𜶛', '▜',
    '𜶜', '𜶝', '𜶞', '𜶟', '𜶠', '𜶡', '𜶢', '𜶣', '𜶤', '𜶥', '𜶦', '𜶧', '𜶨', '𜶩', '𜶪', '𜶫',
    '▂', '𜶬', '𜶭', '𜶮', '𜶯', '𜶰', '𜶱', '𜶲', '𜶳', '𜶴', '𜶵', '𜶶', '𜶷', '𜶸', '𜶹', '𜶺',
    '𜶻', '𜶼', '𜶽', '𜶾', '𜶿', '𜷀', '𜷁', '𜷂', '𜷃', '𜷄', '𜷅', '𜷆', '𜷇', '𜷈', '𜷉', '𜷊',
    '𜷋', '𜷌', '𜷍', '𜷎', '𜷏', '𜷐', '𜷑', '𜷒', '𜷓', '𜷔', '𜷕', '𜷖', '𜷗', '𜷘', '𜷙', '𜷚',
    '▄', '𜷛', '𜷜', '𜷝', '𜷞', '▙', '𜷟', '𜷠', '𜷡', '𜷢', '▟', '𜷣', '▆', '𜷤', '𜷥', '█'
];

const RBL = 4;
const CBL = 2;

// Pixels per byte, 4 for CGA 320x200
const PPB = 4;

const loadCgaImage = async (filename) => {
    // Convert an image to CGA format: 320x200, 2 bits per pixel, interlaced
    const cols = 320, rows = 200, ppb = 4, palette = palette1;

    const image = await sharp(filename)
        .resize(cols, rows, { fit: 'inside' })
        .toColorspace('srgb');

    const buffer = await image.raw().toBuffer({ resolveWithObject: true });

    const cgaimg = [];

    for (let r = 0; r < rows; r++) {
        const cgar = r % 2 === 0 ? r : r + 0x2000;

        for (let c = 0; c < cols; c += ppb) {
            const cgac = c / ppb;

            let cgapx = 0;
            for (let p = 0; p < ppb; p++) {
                const index = 3 * r * cols + c + p;
                const color = {
                    r: buffer.data[index + 0],
                    g: buffer.data[index + 1],
                    b: buffer.data[index + 2]
                };

                const dist = palette.map((pcolor, i) => [
                    i, Math.abs(color.r - pcolor.r) + Math.abs(color.g - pcolor.g) + Math.abs(color.b - pcolor.b)
                ]);
                const match = dist.sort((a, b) => a[1] - b[1])[0][0];

                cgapx += (match << (2 * p));
            }

            cgaimg[cgar * 80 + cgac] = cgapx;
        }
    }

    return cgaimg;
};

const displayCga_320x200 = (data) => {
    for (let addr = 0; addr < 0x4000; addr++) {
        writeCga_320x200(addr, data);
    }
};

const writeCga_320x200 = (addr, data) => {
    // Update all characters affected by writing one byte to CGA memory (that's 2 characters for 320x200)
    //
    // bits:     01 23 45 67 01 23 45 67 01 23 45 67 01 23 45 67
    // bytes:   |           |           |           |           |
    // pixels:  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
    // chars:   |     |     |     |     |     |     |     |     |
    //                       aa bb aa bb
    //                       cc dd cc dd
    //                       ee ff ee ff
    //                       gg hh gg hh
    //
    // If the second byte was updated, it means four pixels in one pixel row were updated
    // That means two characters were updated (since each character is two pixels wide)
    // Those two characters together cover four pixel columns and four pixel rows
    //
    // We will calculate  memory coordinates of all pixels covered by those two characters,
    // build those two characters from the pixels, then calculate their on-screen coordinates
    // and print them there

    // Also, don't forget that CGA memory is interlaced
    const odd = addr >= 0x2000;
    if (odd) addr -= 0x2000;

    // Calculate CGA pixel coordinates from the memory address
    // TODO use shr + div5/mod5 for the division/modulo
    const cgar = Math.floor(addr / 80) * 2 + odd;
    const cgac = (addr % 80) * PPB;     // first out of PPB = 4 columns updated on this row

    // Calculate terminal character cordinates from CGA pixel coordinates
    // TODO use shr for the division
    const termr = Math.floor(cgar / RBL);
    const termc = Math.floor(cgac / CBL);   // first out of PPB / CBL = 2 characters updated on this row

    // Calculate CGA pixel coordinates for the first row first column of the first character
    const charr = termr * RBL;
    const charc = termc * CBL;

    // Find pixels for the two characters
    let ch0 = 0, ch1 = 0;

    // Calculate memory address for the first row of the two characters
    // Use the fact that first row of each character is an even number
    // aa bb aa bb -> 0b000000ba
    let charaddr = Math.floor(charr / 2) * 80 + Math.floor(charc / 4);
    // TODO use bits and shr, perhaps a special table for half-nibbles
    // TODO this would be easier if BLOCK_4x2 was ordered differently (aa bb cc dd, not dd cc bb aa)
    ch0 += (data[charaddr] & 0b11000000) === 0 ? 0b00000000 : 0b00000001;
    ch0 += (data[charaddr] & 0b00110000) === 0 ? 0b00000000 : 0b00000010;
    ch1 += (data[charaddr] & 0b00001100) === 0 ? 0b00000000 : 0b00000001;
    ch1 += (data[charaddr] & 0b00000011) === 0 ? 0b00000000 : 0b00000010;

    // Second row of the two characters
    // cc dd cc dd -> 0b0000dc00
    charaddr = charaddr + 0x2000;
    ch0 += (data[charaddr] & 0b11000000) === 0 ? 0b00000000 : 0b00000100;
    ch0 += (data[charaddr] & 0b00110000) === 0 ? 0b00000000 : 0b00001000;
    ch1 += (data[charaddr] & 0b00001100) === 0 ? 0b00000000 : 0b00000100;
    ch1 += (data[charaddr] & 0b00000011) === 0 ? 0b00000000 : 0b00001000;

    // Third row
    // ee ff ee ff -> 0b00fe0000
    charaddr = charaddr - 0x2000 + 1;
    ch0 += (data[charaddr] & 0b11000000) === 0 ? 0b00000000 : 0b00010000;
    ch0 += (data[charaddr] & 0b00110000) === 0 ? 0b00000000 : 0b00100000;
    ch1 += (data[charaddr] & 0b00001100) === 0 ? 0b00000000 : 0b00010000;
    ch1 += (data[charaddr] & 0b00000011) === 0 ? 0b00000000 : 0b00100000;

    // Fourth row of the two characters
    // gg hh gg hh -> 0bhg000000
    charaddr = charaddr + 0x2000;
    ch0 += (data[charaddr] & 0b11000000) === 0 ? 0b00000000 : 0b01000000;
    ch0 += (data[charaddr] & 0b00110000) === 0 ? 0b00000000 : 0b10000000;
    ch1 += (data[charaddr] & 0b00001100) === 0 ? 0b00000000 : 0b01000000;
    ch1 += (data[charaddr] & 0b00000011) === 0 ? 0b00000000 : 0b10000000;

    // Output the two characters
    setCursor(termr + 1, termc + 1);

    // TODO color
    setForeground(0xff, 0xff, 0xff);
    setBackground(0x00, 0x00, 0x00);

    process.stdout.write(BLOCKS_4x2[ch0]);
    process.stdout.write(BLOCKS_4x2[ch1]);
};

const dumpRawImage = (data) => {
    for (let r = 0; r < 200; r++) {
        for (let c = 0; c < 320; c++) {
            process.stdout.write(data[r * 320 + c] === 0 ? ' ' : 'X');
        }
    }
};

const main = async () => {
    const cgaimg = await loadCgaImage('av1.gif');
    //const cgaimg = await loadCgaImage('ac1.gif');

    dumpRawImage(cgaimg);
    return 0;

    hideCursor();
    saveCursor();
    alternateBuffer();
    clearDisplay();

    //displayCga_320x200(cgaimg, palette1);
    resetColor();

    await keypress();

    normalBuffer();
    restoreCursor();
    showCursor();
};

await main();
