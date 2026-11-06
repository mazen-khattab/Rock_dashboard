type DeleteModalProps = {
    type: string;
    name: string;
    canselFunction: () => void;
    handleDeleteProduct: () => void;
    isDeleting: boolean;
};

export const DeleteModal = ({ type, name, canselFunction, handleDeleteProduct, isDeleting }: DeleteModalProps) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-${type}-title`}
        >
            <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6 shadow-2xl">
                <h2 id={`delete-${type}-title`} className="text-lg sm:text-xl font-bold text-zinc-100">
                    Delete {type}?
                </h2>
                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-zinc-400">
                    This {type} will be soft deleted. After 30 days, it will be removed permanently.
                </p>
                <p className="mt-3 rounded-xl border border-zinc-800/80 bg-zinc-900/90 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-zinc-300 break-all">
                    {name}
                </p>

                <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        className="w-full sm:w-auto cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs sm:text-sm font-medium text-zinc-300 transition hover:bg-zinc-850 hover:text-zinc-100 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={canselFunction}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="w-full sm:w-auto cursor-pointer rounded-xl border border-rose-900/40 bg-zinc-850 px-4 py-2 text-xs sm:text-sm font-semibold text-rose-300 transition hover:bg-zinc-800 hover:text-rose-200 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleDeleteProduct}
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : `Delete ${type}`}
                    </button>
                </div>
            </div>
        </div>
    );
};
