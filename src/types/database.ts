export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          team_id: string | null
          role: 'manager' | 'member'
          email: string | null
          name: string | null
          created_at: string
        }
        Insert: {
          id: string
          team_id?: string | null
          role?: 'manager' | 'member'
          email?: string | null
          name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          team_id?: string | null
          role?: 'manager' | 'member'
          email?: string | null
          name?: string | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          owner_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          owner_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          owner_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}