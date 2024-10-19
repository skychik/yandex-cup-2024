import {
    BlobReader,
    BlobWriter,
    TextReader,
    TextWriter,
    ZipReader,
    ZipWriter,
    Reader,
} from "@zip.js/zip.js";

export function compress(text: string): ArrayBuffer {
    const strs = text.split('\n');

    const buf = new ArrayBuffer(strs.length * 4)
    const uint = new Uint8Array(buf)

    const nums = strs.map(str => str.slice(1)).map(str => {
        // 99
        const body = Number(str.slice(0, 2)) - 1
        // 28
        const stoianka = Number(str.slice(2, 4)) - 1
        // 10
        const stvol = Number(str.slice(4, 6)) - 1
        // 12
        const vetv = Number(str.slice(6, 8)) - 1
        // 12
        const month = Number(str.slice(8, 10)) - 1
        // 30
        const day = Number(str.slice(10, 12)) - 1

        let multiplier = 1;
        let res = 0;
        res += day * multiplier;
        multiplier *= 30;
        res += month * multiplier;
        multiplier *= 12;
        res += vetv * multiplier;
        multiplier *= 12;
        res += stvol * multiplier;
        multiplier *= 10;
        res += stoianka * multiplier;
        multiplier *= 28;
        res += body * multiplier;

        return res
    })

    for (let i = 0; i < strs.length; i++) {
        const num = nums[i];
        const offset = i * 4;

        uint[offset] = num & 0xff;
        uint[offset + 1] = (num >> 8) & 0xff;
        uint[offset + 2] = (num >> 16) & 0xff;
        uint[offset + 3] = (num >> 24) & 0xff;
    }

    return buf;
}

export function decompress(buffer: ArrayBuffer): string {
    const uint = new Uint8Array(buffer);

    const nums = [];
    for (let i = 0; i < uint.length; i += 4) {
        const num = uint[i] | (uint[i + 1] << 8) | (uint[i + 2] << 16) | (uint[i + 3] << 24);
        nums.push(num);
    }

    const strs = nums.map(num => {
        let res = '';

        const day = num % 30;
        const month = Math.floor(num / 30) % 12;
        const vetv = Math.floor(num / 30 / 12) % 12;
        const stvol = Math.floor(num / 30 / 12 / 12) % 10;
        const stoianka = Math.floor(num / 30 / 12 / 12 / 10) % 28;
        const body = Math.floor(num / 30 / 12 / 12 / 10 / 28) % 99;

        return '辰'
            + (body + 1).toString().padStart(2, '0')
            + (stoianka + 1).toString().padStart(2, '0')
            + (stvol + 1).toString().padStart(2, '0')
            + (vetv + 1).toString().padStart(2, '0')
            + (month + 1).toString().padStart(2, '0')
            + (day + 1).toString().padStart(2, '0')
    })

    return strs.join('\n');
}

//
//
//
//
//

const text = `辰112404110313
辰120904070423
辰260702060324
辰360701040830
辰422106090721
辰712404040804
辰932201121106`;

const buffer = compress(text);

console.log('my', buffer.byteLength);

const restored_text = decompress(buffer);

console.log(restored_text);

if (text !== restored_text) {
    console.log('decompress(compress(x)) != x')
}


export async function zipCompress(text: string) {
    const zipFileWriter = new BlobWriter();
    const zipWriter = new ZipWriter(zipFileWriter, {level: 5});
    await zipWriter.add("t", new TextReader(text));
    await zipWriter.close();
    const zipFileBlob = await zipFileWriter.getData();
    return await zipFileBlob.arrayBuffer();
}

export async function zipDecompress(buffer: ArrayBuffer) {
    const zipReader = new ZipReader(new BlobReader(new Blob([buffer])));
    const entries = await zipReader.getEntries();
    const text = await entries.shift().getData(new TextWriter());
    await zipReader.close();

    return text;
}

(async () => {
    const zip_buffer = await zipCompress(text);

    console.log('his', zip_buffer.byteLength);

    // const zip_restored_text = await zipDecompress(zip_buffer);

    // console.log(zip_restored_text);
})()

for (let i = 0; i < 10000000; i++) {
    // heavy computation
    const t = i * i;
}