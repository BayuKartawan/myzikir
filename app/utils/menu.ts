export const availableTables = [
    {
        key: 'zikir-setelah-shalat',
        apiKey: 'zikir_setelah_shalat',
        label: 'Zikir Setelah Shalat',
        description: 'Bacaan zikir setelah melaksanakan shalat fardhu',
        icon: 'lucide:book-marked',
        next: 'doa-setelah-shalat'
    },
    {
        key: 'doa-setelah-shalat',
        apiKey: 'doa_setelah_shalat',
        label: 'Doa Setelah Shalat',
        description: 'Bacaan doa setelah melaksanakan shalat fardhu',
        icon: 'lucide:sun'
    },
    {
        key: 'Tahlil',
        apiKey: 'Tahlil',
        label: 'Tahlil',
        description: 'Bacaan tahlil',
        icon: 'lucide:book-open',
        next: 'doa-tahlil'
    },
    {
        key: 'doa-tahlil',
        apiKey: 'doa_tahlil',
        label: 'Doa Tahlil',
        description: 'Bacaan doa tahlil',
        icon: 'lucide:book-open'
    },
    // Nanti jika ada menu baru, cukup tambah satu objek di bawah ini:
    // { 
    //   key: 'zikir-pagi', 
    //   apiKey: 'zikir_pagi', 
    //   label: 'Zikir Pagi', 
    //   description: 'Bacaan zikir pagi hari', 
    //   icon: 'lucide:sunrise' 
    // },
]
