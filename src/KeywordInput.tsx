import { ForwardedRef, forwardRef } from "react";

const KeywordInput = forwardRef((_, ref: ForwardedRef<HTMLInputElement>) => {
    return <input type="search" required placeholder="Write to search ..." ref={ref} />;
});

export default KeywordInput;