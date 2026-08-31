export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      despesas_fixas: {
        Row: {
          chave: string
          created_at: string
          id: string
          rotulo: string
          valor_centavos: number
        }
        Insert: {
          chave: string
          created_at?: string
          id?: string
          rotulo: string
          valor_centavos?: number
        }
        Update: {
          chave?: string
          created_at?: string
          id?: string
          rotulo?: string
          valor_centavos?: number
        }
        Relationships: []
      }
      fechamento_pagamentos: {
        Row: {
          ajuste_centavos: number
          created_at: string
          fechamento_id: string
          id: string
          moradora_id: string | null
          nome_moradora: string
          ordem: number
          telefone: string
          tipo_quarto: string
          valor_pago_centavos: number
        }
        Insert: {
          ajuste_centavos: number
          created_at?: string
          fechamento_id: string
          id?: string
          moradora_id?: string | null
          nome_moradora: string
          ordem?: number
          telefone: string
          tipo_quarto: string
          valor_pago_centavos: number
        }
        Update: {
          ajuste_centavos?: number
          created_at?: string
          fechamento_id?: string
          id?: string
          moradora_id?: string | null
          nome_moradora?: string
          ordem?: number
          telefone?: string
          tipo_quarto?: string
          valor_pago_centavos?: number
        }
        Relationships: [
          {
            foreignKeyName: "fechamento_pagamentos_fechamento_id_fkey"
            columns: ["fechamento_id"]
            isOneToOne: false
            referencedRelation: "fechamentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fechamento_pagamentos_moradora_id_fkey"
            columns: ["moradora_id"]
            isOneToOne: false
            referencedRelation: "moradoras"
            referencedColumns: ["id"]
          },
        ]
      }
      fechamentos: {
        Row: {
          aluguel_centavos: number
          condominio_centavos: number
          data_criacao: string
          despesas_proprietaria_centavos: number
          id: string
          internet_centavos: number
          luz_centavos: number
          mes_referencia: string
          seguro_centavos: number
          total_geral_centavos: number
          valor_imobiliaria_centavos: number
        }
        Insert: {
          aluguel_centavos: number
          condominio_centavos: number
          data_criacao?: string
          despesas_proprietaria_centavos: number
          id?: string
          internet_centavos: number
          luz_centavos: number
          mes_referencia: string
          seguro_centavos: number
          total_geral_centavos: number
          valor_imobiliaria_centavos: number
        }
        Update: {
          aluguel_centavos?: number
          condominio_centavos?: number
          data_criacao?: string
          despesas_proprietaria_centavos?: number
          id?: string
          internet_centavos?: number
          luz_centavos?: number
          mes_referencia?: string
          seguro_centavos?: number
          total_geral_centavos?: number
          valor_imobiliaria_centavos?: number
        }
        Relationships: []
      }
      moradoras: {
        Row: {
          ajuste_centavos: number
          ativo: boolean
          created_at: string
          id: string
          nome: string
          ordem: number
          telefone: string
          tipo_quarto: string
        }
        Insert: {
          ajuste_centavos?: number
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
          ordem?: number
          telefone: string
          tipo_quarto: string
        }
        Update: {
          ajuste_centavos?: number
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
          ordem?: number
          telefone?: string
          tipo_quarto?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
