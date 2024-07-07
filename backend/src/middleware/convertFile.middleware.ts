async function convertFileToBase64(file: File): Promise<string> {
    const reader = new Response(file.stream()).body?.getReader();
    let chunks: Uint8Array[] = [];

    if (!reader) {
        throw new Error('Failed to create reader');
    }

    while (true) {
        const { done, value } = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
    }

    const concatenated = new Uint8Array(chunks.reduce((totalLength, chunk) => totalLength + chunk.length, 0));
    let offset = 0;

    for (const chunk of chunks) {
        concatenated.set(chunk, offset);
        offset += chunk.length;
    }

    return btoa(String.fromCharCode.apply(null, concatenated as any));
}

export default convertFileToBase64;