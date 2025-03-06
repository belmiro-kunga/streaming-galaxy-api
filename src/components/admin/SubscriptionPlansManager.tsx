import React, { useState, useEffect, useCallback } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash, MonitorPlay, Smartphone, Download, Users, Tv } from 'lucide-react';
import { SubscriptionPlan } from '@/types/api';
import { directSupabaseApi } from '@/lib/supabase';
import { planAPI } from '@/services/plans';

const SubscriptionPlansManager: React.FC = () => {
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlanDialogOpen, setIsPlanDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<SubscriptionPlan> | null>(null);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlan | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  
  const cycleMappings = {
    'diário': 'daily',
    'semanal': 'weekly',
    'quinzenal': 'biweekly',
    'mensal': 'monthly',
    'trimestral': 'quarterly',
    'semestral': 'biannual',
    'anual': 'yearly'
  };
  
  const fetchPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("SubscriptionPlansManager: Fetching plans using direct Supabase API");
      const data = await directSupabaseApi.getAllPlans();
      console.log("SubscriptionPlansManager: Plans fetched successfully:", data.length);
      setPlans(data);
    } catch (error) {
      console.error('SubscriptionPlansManager: Error fetching plans:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os planos de assinatura',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);
  
  useEffect(() => {
    fetchPlans();
    
    const channel = supabase
      .channel('public:planos_assinatura')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'planos_assinatura'
      }, (payload) => {
        console.log("SubscriptionPlansManager: Real-time update received", payload);
        fetchPlans();
      })
      .subscribe();
    
    const priceChannel = supabase
      .channel('public:precos_planos')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'precos_planos'
      }, (payload) => {
        console.log("SubscriptionPlansManager: Real-time price update received", payload);
        fetchPlans();
      })
      .subscribe();
    
    return () => {
      channel.unsubscribe();
      priceChannel.unsubscribe();
    };
  }, [fetchPlans]);
  
  const addPlan = () => {
    setDialogMode("add");
    setCurrentPlan({
      nome: "",
      descricao: "",
      qualidade_maxima: "HD",
      telas_simultaneas: 1,
      limite_downloads: 10,
      limite_perfis: 1,
      ciclo_cobranca: "mensal",
      ativo: true,
      precos: [{ 
        moeda_codigo: "AOA", 
        preco: 0,
        plano_id: `temp-${Date.now()}`
      }]
    });
    setIsPlanDialogOpen(true);
  };
  
  const editPlan = (plan: SubscriptionPlan) => {
    setDialogMode("edit");
    setCurrentPlan({ ...plan });
    setIsPlanDialogOpen(true);
  };
  
  const deletePlan = (plan: SubscriptionPlan) => {
    setPlanToDelete(plan);
    setIsDeleteDialogOpen(true);
  };
  
  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      console.log(`SubscriptionPlansManager: Toggling plan status for ${planId} to ${!currentStatus}`);
      const response = await directSupabaseApi.togglePlanStatus(planId, !currentStatus);
      
      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: response.message
        });
      } else {
        toast({
          title: 'Erro',
          description: response.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('SubscriptionPlansManager: Error toggling plan status:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível alterar o status do plano',
        variant: 'destructive'
      });
    }
  };
  
  const handleSavePlan = async () => {
    if (!currentPlan) return;
    
    try {
      console.log("SubscriptionPlansManager: Saving plan:", currentPlan.nome);
      
      if (dialogMode === "add") {
        const response = await directSupabaseApi.createPlan(currentPlan as Omit<SubscriptionPlan, 'id' | 'created_at' | 'updated_at'>);
        
        if (response.status === 201) {
          toast({
            title: 'Sucesso',
            description: 'Plano criado com sucesso'
          });
          setIsPlanDialogOpen(false);
          console.log("SubscriptionPlansManager: Plan created successfully");
          fetchPlans();
        } else {
          toast({
            title: 'Erro',
            description: response.message,
            variant: 'destructive'
          });
        }
      } else {
        if (!currentPlan.id) {
          toast({
            title: 'Erro',
            description: 'ID do plano não encontrado',
            variant: 'destructive'
          });
          return;
        }
        
        const response = await directSupabaseApi.updatePlan(currentPlan.id, currentPlan);
        
        if (response.status === 200) {
          toast({
            title: 'Sucesso',
            description: 'Plano atualizado com sucesso'
          });
          setIsPlanDialogOpen(false);
          console.log("SubscriptionPlansManager: Plan updated successfully");
          fetchPlans();
        } else {
          toast({
            title: 'Erro',
            description: response.message,
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      console.error('SubscriptionPlansManager: Error saving plan:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar o plano',
        variant: 'destructive'
      });
    }
  };
  
  const handlePriceChange = (value: string) => {
    if (!currentPlan || !currentPlan.precos || currentPlan.precos.length === 0) return;
    
    const precos = [...currentPlan.precos];
    const planId = currentPlan.id || `temp-${Date.now()}`;
    
    precos[0] = { 
      ...precos[0], 
      preco: Number(value) || 0,
      plano_id: precos[0].plano_id || planId
    };
    
    setCurrentPlan({
      ...currentPlan,
      precos
    });
  };
  
  const handleDeleteConfirm = async () => {
    if (!planToDelete) return;
    
    try {
      console.log(`SubscriptionPlansManager: Deleting plan ${planToDelete.id}`);
      const response = await directSupabaseApi.deletePlan(planToDelete.id);
      
      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: response.message
        });
        setIsDeleteDialogOpen(false);
        fetchPlans();
      } else {
        toast({
          title: 'Erro',
          description: response.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('SubscriptionPlansManager: Error deleting plan:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o plano',
        variant: 'destructive'
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Planos de Assinatura</h2>
        <Button 
          onClick={addPlan} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Plus size={16} />
          <span>Adicionar Plano</span>
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="bg-gray-900 border-gray-800 overflow-hidden">
              <div className="flex justify-between items-start p-6 bg-gray-800">
                <div>
                  <h3 className="text-xl font-medium">{plan.nome}</h3>
                  <p className="text-sm text-gray-400">{plan.descricao}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    checked={plan.ativo} 
                    onCheckedChange={() => togglePlanStatus(plan.id, plan.ativo)}
                  />
                  <Badge variant={plan.ativo ? "default" : "secondary"}>
                    {plan.ativo ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Tv className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">Qualidade {plan.qualidade_maxima}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{plan.telas_simultaneas} dispositivos</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{plan.limite_downloads} downloads</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <span className="flex-1">{plan.limite_perfis} perfis</span>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-400">Preço</div>
                  <div className="text-2xl font-bold">
                    {plan.precos && plan.precos[0] ? 
                      `${plan.precos[0].moeda_codigo} ${plan.precos[0].preco.toLocaleString()}` : 
                      "Preço não definido"}
                  </div>
                  <div className="text-xs text-gray-500">{plan.ciclo_cobranca}</div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-blue-900/30 text-blue-400 border-blue-800 hover:bg-blue-900"
                    onClick={() => editPlan(plan)}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-red-900/30 text-red-400 border-red-800 hover:bg-red-900"
                    onClick={() => deletePlan(plan)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {plans.length === 0 && !isLoading && (
        <div className="text-center p-10 border border-dashed border-gray-700 rounded-lg">
          <p className="text-gray-400">Nenhum plano de assinatura cadastrado.</p>
          <Button 
            variant="outline"
            className="mt-4"
            onClick={addPlan}
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Plano
          </Button>
        </div>
      )}
      
      <Dialog open={isPlanDialogOpen} onOpenChange={setIsPlanDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>{dialogMode === "add" ? "Adicionar Novo Plano" : "Editar Plano"}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {dialogMode === "add" 
                ? "Preencha os dados para adicionar um novo plano de assinatura." 
                : "Atualize as informações do plano de assinatura."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Plano</Label>
                <Input 
                  id="name" 
                  value={currentPlan?.nome || ""}
                  onChange={(e) => setCurrentPlan({...currentPlan, nome: e.target.value})}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Ex: Premium, Básico, etc."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="billing-cycle">Ciclo de Cobrança</Label>
                <Select 
                  value={currentPlan?.ciclo_cobranca || "mensal"} 
                  onValueChange={(value) => setCurrentPlan({...currentPlan, ciclo_cobranca: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione o ciclo" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="diário">Diário</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quinzenal">Quinzenal</SelectItem>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="trimestral">Trimestral</SelectItem>
                    <SelectItem value="semestral">Semestral</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input 
                id="description" 
                value={currentPlan?.descricao || ""}
                onChange={(e) => setCurrentPlan({...currentPlan, descricao: e.target.value})}
                className="bg-gray-800 border-gray-700 text-white"
                placeholder="Breve descrição do plano"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quality">Qualidade Máxima</Label>
                <Select 
                  value={currentPlan?.qualidade_maxima || "HD"} 
                  onValueChange={(value) => setCurrentPlan({...currentPlan, qualidade_maxima: value})}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione a qualidade" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="SD">SD</SelectItem>
                    <SelectItem value="HD">HD</SelectItem>
                    <SelectItem value="Full HD">Full HD</SelectItem>
                    <SelectItem value="Ultra HD">Ultra HD</SelectItem>
                    <SelectItem value="4K">4K</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Preço (AOA)</Label>
                <Input 
                  id="price" 
                  type="number"
                  value={currentPlan?.precos?.[0]?.preco || 0}
                  onChange={(e) => handlePriceChange(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Preço em Kwanzas"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="screens">Telas Simultâneas</Label>
                <Input 
                  id="screens" 
                  type="number"
                  min="1"
                  max="10"
                  value={currentPlan?.telas_simultaneas || 1}
                  onChange={(e) => setCurrentPlan({...currentPlan, telas_simultaneas: Number(e.target.value) || 1})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="downloads">Limite de Downloads</Label>
                <Input 
                  id="downloads" 
                  type="number"
                  min="0"
                  value={currentPlan?.limite_downloads || 0}
                  onChange={(e) => setCurrentPlan({...currentPlan, limite_downloads: Number(e.target.value) || 0})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="profiles">Limite de Perfis</Label>
                <Input 
                  id="profiles" 
                  type="number"
                  min="1"
                  max="10"
                  value={currentPlan?.limite_perfis || 1}
                  onChange={(e) => setCurrentPlan({...currentPlan, limite_perfis: Number(e.target.value) || 1})}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="active"
                checked={currentPlan?.ativo || false} 
                onCheckedChange={(checked) => setCurrentPlan({...currentPlan, ativo: checked})}
              />
              <Label htmlFor="active">Plano Ativo</Label>
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleSavePlan}
              disabled={!currentPlan?.nome}
              className="bg-primary hover:bg-primary/90"
            >
              {dialogMode === "add" ? "Adicionar" : "Atualizar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o plano "{planToDelete?.nome}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="bg-gray-800 text-white border-gray-700 hover:bg-gray-700">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubscriptionPlansManager;
