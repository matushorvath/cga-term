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

// const PALETTE0 = [
//     { r:   0, g:   0, b:   0 },         // black
//     { r: 170, g:   0, b:   0 },         // red
//     { r:   0, g: 170, b:   0 },         // green
//     { r: 170, g: 170, b:  85 }          // yellow
// ];

const PALETTE1_LO = [
    { r:   0, g:   0, b:   0 },         // black
    { r: 170, g:   0, b: 170 },         // magenta
    { r:   0, g: 170, b: 170 },         // cyan
    { r: 170, g: 170, b: 170 }          // white
];

const PALETTE1_HI = [
    { r:   0, g:   0, b:   0 },         // black
    { r: 255, g:  85, b: 255 },         // magenta
    { r:  85, g: 255, b: 255 },         // cyan
    { r: 255, g: 255, b: 255 }          // white
];

// If colors a,b will be used in a character, use map[a << 2 + b].
// The map convers each 2-bit CGA color to a or b (0 or 1).
const COLOR_MAPPINGS_PALETTE1 = [
//   B  M  C  W
    undefined,              // 0,0          0
    [0, 1, 1, 1],           // 0,1 0b_0001  1
    [0, 1, 1, 1],           // 0,2 0b_0010  2
    [0, 1, 1, 1],           // 0,3 0b_0011  3
    [1, 0, 0, 0],           // 1,0 0b_0100  4
    undefined,              // 1,1          5
    [1, 0, 1, 1],           // 1,2 0b_0110  6
    [0, 0, 1, 1],           // 1,3 0b_0111  7
    [1, 0, 0, 0],           // 2,0 0b_1000  8
    [0, 1, 0, 0],           // 2,1 0b_1001  9
    undefined,              // 2,2         10
    [0, 1, 0, 1],           // 2,3 0b_1011 11
    [1, 0, 0, 0],           // 3,0 0b_1100 12
    [1, 1, 0, 0],           // 3,1 0b_1101 13
    [1, 0, 1, 0],           // 3,2 0b_1110 14
    undefined               // 3,3         15
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

const loadCgaImage = async (filename, palette) => {
    // Convert an image to CGA format: 320x200, 2 bits per pixel, interlaced
    const cols = 320, rows = 200, ppb = 4;

    const image = await sharp(filename)
        .resize(cols, rows, { fit: 'cover' })
        .toColorspace('srgb');

    const buffer = await image.raw().toBuffer({ resolveWithObject: true });

    const cgaimg = [];

    for (let r = 0; r < rows; r++) {
        const cgar = (r % 2 === 0 ? 0 : 0x2000) + Math.floor(r / 2) * 80;

        for (let c = 0; c < cols; c += ppb) {
            const cgac = Math.floor(c / ppb);

            let cgapx = 0;
            for (let p = 0; p < ppb; p++) {
                const index = buffer.info.channels * (r * cols + c + p);
                const color = {
                    r: buffer.data[index + 0],
                    g: buffer.data[index + 1],
                    b: buffer.data[index + 2]
                };

                const dist = palette.map((pcolor, i) => [
                    i, Math.abs(color.r - pcolor.r) + Math.abs(color.g - pcolor.g) + Math.abs(color.b - pcolor.b)
                ]);
                const match = dist.sort((a, b) => a[1] - b[1])[0][0];

                cgapx += (match << (2 * (3-p)));
            }

            cgaimg[cgar + cgac] = cgapx;
        }
    }

    return { data: cgaimg, palette };
};

const displayCga_320x200 = (data, palette) => {
    for (let addr = 0; addr < 0x4000; addr++) {
        writeCga_320x200(addr, data, palette);
    }
};

const writeCga_320x200 = (addr, data, palette) => {
    // Update all characters affected by writing one byte to CGA memory (that's 2 characters for 320x200)
    //
    // bits:     01 23 45 67 01 23 45 67 01 23 45 67 
    // bytes:   |           |           |           |
    // pixels:  |  |  |  |  |  |  |  |  |  |  |  |  |
    // chars:   |     |     |     |     |     |     |
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

    // check for address too large to be on screen
    if (addr >= 100 * 80) return;

    // Calculate CGA pixel coordinates from the memory address
    // ICTD use shr + div5/mod5 for the division/modulo
    const cgar = Math.floor(addr / 80) * 2 + odd;
    const cgac = (addr % 80) * PPB;     // first out of PPB = 4 columns updated on this row

    // Calculate terminal character cordinates from CGA pixel coordinates
    // ICTD use shr for the division
    const termr = Math.floor(cgar / RBL);
    const termc = Math.floor(cgac / CBL);   // first out of PPB / CBL = 2 characters updated on this row

    // Calculate CGA pixel coordinates for the first row first column of the first character
    const charr = termr * RBL;
    const charc = termc * CBL;

    // Find pixels for the two characters
    let ch0 = 0, ch1 = 0;

    // Calculate memory address for each row of the two characters
    // Use the fact that first row of each character is an even number
    // ICTD use bits and shr, perhaps a special table for half-nibbles
    const addr_row0 = Math.floor(charr / 2) * 80 + Math.floor(charc / 4);
    const addr_row1 = addr_row0 + 0x2000;
    const addr_row2 = addr_row0 + 80;
    const addr_row3 = addr_row1 + 80;

    // Count which colors are used in this character
    const clrs0 = [0, 0, 0, 0];
    const clrs1 = [0, 0, 0, 0];

    clrs0[(data[addr_row0] >> 6) & 0b11]++;
    clrs0[(data[addr_row0] >> 4) & 0b11]++;
    clrs1[(data[addr_row0] >> 2) & 0b11]++;
    clrs1[(data[addr_row0] >> 0) & 0b11]++;

    clrs0[(data[addr_row1] >> 6) & 0b11]++;
    clrs0[(data[addr_row1] >> 4) & 0b11]++;
    clrs1[(data[addr_row1] >> 2) & 0b11]++;
    clrs1[(data[addr_row1] >> 0) & 0b11]++;

    clrs0[(data[addr_row2] >> 6) & 0b11]++;
    clrs0[(data[addr_row2] >> 4) & 0b11]++;
    clrs1[(data[addr_row2] >> 2) & 0b11]++;
    clrs1[(data[addr_row2] >> 0) & 0b11]++;

    clrs0[(data[addr_row3] >> 6) & 0b11]++;
    clrs0[(data[addr_row3] >> 4) & 0b11]++;
    clrs1[(data[addr_row3] >> 2) & 0b11]++;
    clrs1[(data[addr_row3] >> 0) & 0b11]++;

    // Find two most used colors in this character
    // TODO refactor common code for color handling, we do the whole thing twice not just this lambda
    const sortcolors = (clrs) => {
        const clrs01 = clrs.slice(0, 2);
        const clrs23 = clrs.slice(2);
        const twocolors = [0, 0];

        const max01 = clrs01[0] < clrs01[1] ? 1 : 0;
        const max23 = clrs23[0] < clrs23[1] ? 1 : 0;
        if (clrs01[max01] < clrs23[max23]) {
            twocolors[0] = max23 + 2;
            const min23 = (max23 ? 0 : 1);
            if (clrs01[max01] < clrs23[min23]) {
                twocolors[1] = min23 + 2;
            } else {
                twocolors[1] = max01;
            }
        } else {
            twocolors[0] = max01;
            const min01 = (max01 ? 0 : 1);
            if (clrs01[min01] < clrs23[max23]) {
                twocolors[1] = max23 + 2;
            } else {
                twocolors[1] = min01;
            }
        }
        return twocolors;
    };
    const twocolors0 = sortcolors(clrs0);
    const twocolors1 = sortcolors(clrs1);

    // Find a color mapping based on the two most used colors
    // TODO refactor, duplication
    const tcbin0 = (twocolors0[0] << 2) + twocolors0[1];
    const tcbin1 = (twocolors1[0] << 2) + twocolors1[1];
    const map0 = COLOR_MAPPINGS_PALETTE1[tcbin0];
    const map1 = COLOR_MAPPINGS_PALETTE1[tcbin1];

    // First row of the two characters
    // aa bb aa bb -> 0b_000000ba
    ch0 += map0[(data[addr_row0] >> 6) & 0b11] << 0;
    ch0 += map0[(data[addr_row0] >> 4) & 0b11] << 1;
    ch1 += map1[(data[addr_row0] >> 2) & 0b11] << 0;
    ch1 += map1[(data[addr_row0] >> 0) & 0b11] << 1;

    // Second row
    // cc dd cc dd -> 0b_0000dc00
    ch0 += map0[(data[addr_row1] >> 6) & 0b11] << 2;
    ch0 += map0[(data[addr_row1] >> 4) & 0b11] << 3;
    ch1 += map1[(data[addr_row1] >> 2) & 0b11] << 2;
    ch1 += map1[(data[addr_row1] >> 0) & 0b11] << 3;

    // Third row
    // ee ff ee ff -> 0b_00fe0000
    ch0 += map0[(data[addr_row2] >> 6) & 0b11] << 4;
    ch0 += map0[(data[addr_row2] >> 4) & 0b11] << 5;
    ch1 += map1[(data[addr_row2] >> 2) & 0b11] << 4;
    ch1 += map1[(data[addr_row2] >> 0) & 0b11] << 5;

    // Fourth row
    // gg hh gg hh -> 0b_hg000000
    ch0 += map0[(data[addr_row3] >> 6) & 0b11] << 6;
    ch0 += map0[(data[addr_row3] >> 4) & 0b11] << 7;
    ch1 += map1[(data[addr_row3] >> 2) & 0b11] << 6;
    ch1 += map1[(data[addr_row3] >> 0) & 0b11] << 7;

    // Output the two characters
    setCursor(termr + 1, termc + 1);

    const fg0 = palette[twocolors0[1]];
    setForeground(fg0.r, fg0.g, fg0.b);
    const bg0 = palette[twocolors0[0]];
    setBackground(bg0.r, bg0.g, bg0.b);

    process.stdout.write(BLOCKS_4x2[ch0]);

    const fg1 = palette[twocolors1[1]];
    setForeground(fg1.r, fg1.g, fg1.b);
    const bg1 = palette[twocolors1[0]];
    setBackground(bg1.r, bg1.g, bg1.b);

    process.stdout.write(BLOCKS_4x2[ch1]);
};

const dumpRawImage = (data) => {
    for (let r = 0; r < 200; r++) {
        const memr = (r % 2 === 0 ? 0 : 0x2000) + Math.floor(r / 2) * 80;
        for (let c = 0; c < 80; c++) {
            process.stdout.write(data[memr + c] === 0 ? ' ' : 'X');
        }
        process.stdout.write('\n');
    }
};

const main = async () => {
    //const { data, palette } = await loadCgaImage('ac1.gif', PALETTE1_LO);
    //const { data, palette } = await loadCgaImage('av1.gif', PALETTE1_LO);
    //const { data, palette } = await loadCgaImage('pr1.gif', PALETTE1_HI);
    const { data, palette } = await loadCgaImage('pr2.png', PALETTE1_LO);

    //dumpRawImage(cgaimg);
    //return 0;

    hideCursor();
    saveCursor();
    alternateBuffer();
    clearDisplay();

    displayCga_320x200(data, palette);
    resetColor();

    await keypress();

    normalBuffer();
    restoreCursor();
    showCursor();
};

await main();
