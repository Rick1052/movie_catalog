import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <div className="flex flex-col items-start">
            <input
                {...props}
                type={type}
                className={
                    'bg-gray-100 text-gray-900 border-2 border-gray-400 placeholder-gray-500 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 rounded-md shadow-sm px-4 py-2 transition-colors duration-200 ' +
                    className
                }
                ref={input}
            />
        </div>
    );
});
