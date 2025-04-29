export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
  }) {
    // Show up to 5 numbered page buttons around the current page
    const getPageNumbers = () => {
      const maxVisible = 5;
      const pages = [];
  
      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
  
      if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
      }
  
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
  
      return pages;
    };
  
    return (
      <div className="flex flex-wrap justify-center items-center gap-2 mt-8 text-sm px-2 sm:px-0">

        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="text-gray-700 disabled:text-gray-300"
        >
          &laquo;
        </button>
  
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="border px-3 py-1 rounded disabled:text-gray-400"
        >
          &lsaquo; Previous
        </button>
  
        {/* Page X of Y */}
        <span className="mx-2 text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
  
        {/* Numbered buttons */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`border px-3 py-1 rounded ${
              page === currentPage
                ? "bg-[#723248] text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}
  
        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="border px-3 py-1 rounded disabled:text-gray-400"
        >
          Next &rsaquo;
        </button>
  
        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="text-gray-700 disabled:text-gray-300"
        >
          &raquo;
        </button>
      </div>
    );
  }
  