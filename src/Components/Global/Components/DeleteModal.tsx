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
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-xs"
            role="dialog"
            aria-modal="true"
            aria-labelledby={`delete-${type}-title`}
        >
            <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-6 shadow-xl">
                <h2 id={`delete-${type}-title`} className="text-lg sm:text-xl font-semibold text-slate-900">
                    Delete {type}?
                </h2>
                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600">
                    This {type} will be soft deleted. After 30 days, it will be deleted permanently.
                </p>
                <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 break-all">
                    {name}
                </p>

                <div className="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3">
                    <button
                        type="button"
                        className="w-full sm:w-auto cursor-pointer rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={canselFunction}
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="w-full sm:w-auto cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
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
