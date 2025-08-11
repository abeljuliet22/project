class Book {
    constructor(title, author, genre, status, image) {
        this.title = title;
        this.author = author;
        this.genre = genre;
        this.status = status;
        this.image = image || "https://via.placeholder.com/100x150";
    }

    checkout() {
        this.status = "Checked Out";
    }

    returnBook() {
        this.status = "Available";
    }
}

let library = [];

// Render books
function renderBooks(books = library) {
    const tableBody = document.getElementById("bookTableBody");
    tableBody.innerHTML = "";
    books.forEach((book, index) => {
        tableBody.innerHTML += `
            <tr>
                <td><img src="${book.image}" alt="${book.title}" width="50" height="75" class="rounded"></td>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.genre}</td>
                <td>${book.status}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editBook(${index})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBook(${index})">Delete</button>
                    <button class="btn btn-sm btn-info" onclick="toggleStatus(${index})">Toggle Status</button>
                </td>
            </tr>
        `;
    });
}

// Add or update book
document.getElementById("bookForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const title = document.getElementById("titleInput").value.trim();
    const author = document.getElementById("authorInput").value.trim();
    const genre = document.getElementById("genreInput").value.trim();
    const image = document.getElementById("imageInput").value.trim();
    const status = document.getElementById("statusInput").value;
    const editIndex = document.getElementById("editIndex").value;

    // Prevent duplicates
    const exists = library.some((b, i) => 
        b.title.toLowerCase() === title.toLowerCase() && 
        b.author.toLowerCase() === author.toLowerCase() && 
        i != editIndex
    );
    if (exists) {
        alert("This book already exists.");
        return;
    }

    if (editIndex === "") {
        library.push(new Book(title, author, genre, status, image));
    } else {
        library[editIndex] = new Book(title, author, genre, status, image);
    }

    renderBooks();
    e.target.reset();
    document.getElementById("editIndex").value = "";
    bootstrap.Modal.getInstance(document.getElementById("bookModal")).hide();
});

// Edit book
function editBook(index) {
    const book = library[index];
    document.getElementById("titleInput").value = book.title;
    document.getElementById("authorInput").value = book.author;
    document.getElementById("genreInput").value = book.genre;
    document.getElementById("imageInput").value = book.image;
    document.getElementById("statusInput").value = book.status;
    document.getElementById("editIndex").value = index;
    document.getElementById("modalTitle").innerText = "Edit Book";
    new bootstrap.Modal(document.getElementById("bookModal")).show();
}

// Delete book
function deleteBook(index) {
    if (confirm("Are you sure?")) {
        library.splice(index, 1);
        renderBooks();
    }
}

// Toggle status
function toggleStatus(index) {
    if (library[index].status === "Available") {
        library[index].checkout();
    } else {
        library[index].returnBook();
    }
    renderBooks();
}

// Search books
function searchBooks() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const filtered = library.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.status.toLowerCase().includes(query)
    );
    renderBooks(filtered);
}

// Initial dummy data
library.push(new Book("The Judge's List", "John Grisham", "Fiction", "Available", "https://covers.openlibrary.org/b/id/12509405-L.jpg"));
library.push(new Book("Peril", "Bob Woodward", "Nonfiction", "Checked Out", "https://covers.openlibrary.org/b/id/12460264-L.jpg"));
renderBooks();
